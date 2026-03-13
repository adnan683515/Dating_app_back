

export interface IBooking {
    userId: string;
    eventId: string;
    ticketCount: number;
    fee: number;
    paymentStatus: "pending" | "succeeded" | "failed";
    stripePaymentIntentId?: string;
    createdAt: Date;
}