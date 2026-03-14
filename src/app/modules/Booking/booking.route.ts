import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import { bookingController } from "./booking.controller";



const route = Router()


route.post('/create-booking', checkAuth(...Object.values(Role)), bookingController.eventBooking)

export const BookingRouter = route