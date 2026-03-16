import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { bookingService, stripe } from "./booking.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes'
import Stripe from "stripe";
import { envVars } from "../../config/env";


// booking event
const eventBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


  const userId = req?.user?.id
  req.body.userId = userId
  console.log(req.body)
  const bookingRes = await bookingService.createBooking(req?.body)

  sendResponse(res, {
    message: 'payment successfully!',
    data: bookingRes,
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

export const bookingController = {
  eventBooking,
  webHookController
}