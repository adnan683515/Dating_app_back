import { z } from "zod";

export const bookingZod = z.object({
  userId: z.string().min(1, "User ID is required"),
  eventId: z.string().min(1, "Event ID is required"),
  ticketCount: z.number().min(1, "At least 1 ticket must be booked"),
  fee: z.number().min(0, "Fee must be positive"),
});

export type BookingInput = z.infer<typeof bookingZod>;