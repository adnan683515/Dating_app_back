import { model, Schema } from "mongoose";
import { IBooking } from "./booking.interface";


const BookingSchema = new Schema<IBooking>({

    userId: { type: String, required: true },
    eventId: { type: String, required: true },
    ticketCount: { type: Number, required: true },
    fee: { type: Number, required: true },
    paymentStatus: { type: String, default: "pending" },
    stripePaymentIntentId: { type: String },

}, { timestamps: true, versionKey: false });

export const Booking = model<IBooking>("Booking", BookingSchema);