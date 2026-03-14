
import Stripe from "stripe";

import { IBooking } from "./booking.interface";
import { Event } from "../Events/event.model";
import AppError from "../../errorHerlpers/AppError";
import httpStatus from 'http-status-codes'
import { User } from "../User/user.model";
import { envVars } from "../../config/env";
import { Booking, PaymentStatusEnum } from "./booking.model";

// Initialize Stripe
export const stripe = new Stripe(envVars.STRIPE_SECRET_KEY);
/////////////////////////
// Booking Service
/////////////////////////


const createBooking = async (payload: Partial<IBooking>) => {


  const findEvent = await Event.findById(payload.eventId)
  const findUser = await User.findById(payload.userId)

  if (!findEvent) {
    throw new AppError(httpStatus.NOT_FOUND, "This event not found!")
  }
  if (!findUser) {
    throw new AppError(httpStatus.NOT_FOUND, "This user not found!")
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


    success_url: `https://next.programming-hero.com/skills/live-order-tracking-system-with-socketio/outline`,
    cancel_url: `https://console.cloudinary.com/app/c-b8b38954d79c3da125544d8aa32227/image/getting-started`,

    metadata: {
      userId: findUser._id.toString(),
      eventId: findEvent._id.toString(),
    },
  });



  const ticketCount = Number(payload.ticketCount);
  const feePerTicket = Number(findEvent.fee);

  if (isNaN(ticketCount) || ticketCount < 1) {
    throw new Error("Invalid ticket count");
  }

  if (isNaN(feePerTicket) || feePerTicket < 0) {
    throw new Error("Invalid fee");
  }

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



// webHook
const handleEvent = async (stripeEvent: Stripe.Event) => {
  console.log("kiew")
  switch (stripeEvent.type) {
    case "checkout.session.completed":
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const eventId = session.metadata?.eventId;
      console.log(userId, eventId, "from booking web hook service");
      break;

    case "payment_intent.payment_failed":
      console.log("hello your payment is failed");
      break;

    default:
      console.log(`Unhandled event type ${stripeEvent.type}`);
  }
};




export const bookingService = {
  createBooking,
  handleEvent
}