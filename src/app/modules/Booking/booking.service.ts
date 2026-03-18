
import Stripe from "stripe";
import httpStatus from 'http-status-codes';
import { envVars } from "../../config/env";
import AppError from "../../errorHerlpers/AppError";
import { Event } from "../Events/event.model";
import { User } from "../User/user.model";
import { IBooking } from "./booking.interface";
import { Booking, PaymentStatusEnum } from "./booking.model";
import { EStatus } from "../Events/event.interface";
import mongoose, { Types } from "mongoose";

// Initialize Stripe
export const stripe = new Stripe(envVars.STRIPE_SECRET_KEY);

// Booking Service
const createBooking = async (payload: Partial<IBooking>) => {

  const findEvent = await Event.findById(payload.eventId)
  const findUser = await User.findById(payload.userId)

  if (!findEvent) {
    throw new AppError(httpStatus.NOT_FOUND, "This event not found!")
  }
  if (!findUser) {
    throw new AppError(httpStatus.NOT_FOUND, "This user not found!")
  }

  if([EStatus.GOING, EStatus.END, EStatus.CANCELLED].includes(findEvent.status) ){

    throw new AppError(httpStatus.BAD_REQUEST, "sfsdfdsf")
  }


  const ticketCount = Number(payload.ticketCount);
  const feePerTicket = Number(findEvent.fee);



  if (isNaN(ticketCount) || ticketCount < 1) {
    throw new Error("Invalid ticket count");
  }

  if (isNaN(feePerTicket) || feePerTicket < 0) {
    throw new Error("Invalid fee");
  }


  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",

    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: findEvent.title,
            images: [findEvent.image],

          },
          unit_amount: Number(findEvent.fee) * 100,
        },
        quantity: payload.ticketCount ?? 1,
      },
    ],

    customer_email: findUser.email,  // <-- your user email here


    success_url: "http://localhost:3000/payment-success",
    cancel_url: "http://localhost:3000/payment-cancel",

    metadata: {
      userId: findUser._id.toString(),
      eventId: findEvent._id.toString(),
      ticketCount: (payload.ticketCount ?? 1).toString()
    },
  });


  // Calculate total fee
  const totalFee = feePerTicket * ticketCount;


  await Booking.create({
    userId: findUser._id,
    eventId: findEvent._id,
    ticketCount: payload.ticketCount as number,
    fee: totalFee,
    paymentStatus: PaymentStatusEnum.UNPAID,
    txId: session.id
  })

  return session.url;

};



// when payment will be success this webhook will be call
const handleEvent = async (stripeEvent: Stripe.Event) => {

  switch (stripeEvent.type) {

    case "checkout.session.completed":
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const eventId = session.metadata?.eventId;
      // console.log(userId, eventId, "from booking web hook service");
      await Booking.findOneAndUpdate(
        {
          eventId: new mongoose.Types.ObjectId(eventId),
          userId: new mongoose.Types.ObjectId(userId),
        },
        { paymentStatus: PaymentStatusEnum.PAID },
        { returnDocument: 'after', runValidators: true }
      );


      await Event.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(eventId) },
        { $inc: { attendanceTotal: session.metadata?.ticketCount } },
        { returnDocument: 'after' }
      );

      break;
    case "payment_intent.payment_failed":
      console.log("hello your payment is failed");
      break;

    default:
      console.log(`Unhandled event type ${stripeEvent.type}`);
  }
};




// get all my bookings
const getAllBookings = async (myId: string) => {

  
}








export const bookingService = {
  createBooking,
  handleEvent
}