import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import { bookingController } from "./booking.controller";
import { validateRequest } from "../../middlewares/ValidateRequest";
import { bookingZod } from "./booking.validation";



const route = Router()


route.post('/create-booking', validateRequest(bookingZod), checkAuth(...Object.values(Role)), bookingController.eventBooking)


route.get('/get-all-my-bookings' , checkAuth(...Object.values(Role)), bookingController.getAllMyBookings )



export const BookingRouter = route