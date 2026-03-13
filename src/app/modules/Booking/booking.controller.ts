import { Request, Response } from "express";
import { confirmPaymentService, createBookingService, failPaymentService } from "./booking.service";
import { bookingZod } from "./booking.validation";

export const createBookingController = async (req: Request, res: Response) => {
  try {
    const parsed = bookingZod.parse(req.body);
    const { booking, clientSecret } = await createBookingService(parsed);

    res.status(201).json({
      success: true,
      booking,
      clientSecret,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const confirmPaymentController = async (req: Request, res: Response) => {
  const { paymentIntentId } = req.body;

  try {
    const booking = await confirmPaymentService(paymentIntentId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    res.json({ success: true, booking });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const failPaymentController = async (req: Request, res: Response) => {
  const { paymentIntentId } = req.body;

  try {
    const booking = await failPaymentService(paymentIntentId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    res.json({ success: true, booking });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};