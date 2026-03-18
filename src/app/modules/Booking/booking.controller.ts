import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { bookingService, stripe } from "./booking.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes'
import Stripe from "stripe";
import { envVars } from "../../config/env";
import AppError from "../../errorHerlpers/AppError";


// booking event
const eventBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


  const userId = req?.user?.id
  req.body.userId = userId
  if (req?.body?.ticketCount > 10) {
    throw new AppError(httpStatus.BAD_REQUEST, "Maximum ticket count is 10");
  }

  const bookingRes = await bookingService.createBooking(req?.body)

  sendResponse(res, {
    message: 'payment successfully!',
    data: { url: bookingRes },
    statusCode: httpStatus.OK,
    success: true
  })

})



// when payment will be successfull
const webHookController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const sig = req.headers["stripe-signature"]!;

  const endpointSecret = envVars.WEB_HOOK_SECRET;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);


    // Object method call
    await bookingService.handleEvent(event);

    res.status(200).send({ received: true });
  } catch (err: any) {
    console.log("Webhook error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});







// my bookings 
const getAllMyBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


  const myId = req?.user?.id
  const query = req?.query
  const data = await bookingService.getAllMyBookings(myId as string, query as Record<string, string>)
  sendResponse(res, {
    message: 'All my bookings',
    data: data,
    statusCode: httpStatus.OK,
    success: true
  })


})

export const bookingController = {
  eventBooking,
  webHookController,
  getAllMyBookings
}