import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import { eventController } from "./event.controller";
import { validateRequest } from "../../middlewares/ValidateRequest";
import { createEventZod } from "./event.validation";





const route = Router()


// event created
route.post('/create-event', validateRequest(createEventZod), checkAuth(Role.ADMIN), eventController.createEvent)




export const EventRoute = route