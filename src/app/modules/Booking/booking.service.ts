
import Stripe from "stripe";

import { BookingInput } from "./booking.validation";
import { Booking } from "./booking.model";


// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

/////////////////////////
// Booking Service
/////////////////////////
export const createBookingService = async (input: BookingInput) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(input.fee * 100), // USD to cents
    currency: "usd",
    metadata: {
      userId: input.userId,
      eventId: input.eventId,
      ticketCount: input.ticketCount.toString(),
    },
  });

  const booking = await Booking.create({
    ...input,
    paymentStatus: "pending",
    stripePaymentIntentId: paymentIntent.id,
  });

  return { booking, clientSecret: paymentIntent.client_secret! };
};

export const confirmPaymentService = async (stripePaymentIntentId: string) => {
  const booking = await Booking.findOne({ stripePaymentIntentId });
  if (!booking) return null;

  booking.paymentStatus = "succeeded";
  await booking.save();
  return booking;
};

export const failPaymentService = async (stripePaymentIntentId: string) => {
  const booking = await Booking.findOne({ stripePaymentIntentId });
  if (!booking) return null;

  booking.paymentStatus = "failed";
  await booking.save();
  return booking;
};