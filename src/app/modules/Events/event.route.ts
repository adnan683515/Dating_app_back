import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import { eventController } from "./event.controller";
import { validateRequest } from "../../middlewares/ValidateRequest";
import { createEventZod, updateEventZod } from "./event.validation";
import { multerUpload } from "../../config/multer.config";





const route = Router()


// event created
route.post('/create-event', multerUpload.single("file"), validateRequest(createEventZod), checkAuth(Role.ADMIN), eventController.createEvent)


// event details
route.get('/get-event-details/:id', checkAuth(...Object.values(Role)), eventController.eventDetails)


// get-all events
route.get('/events', checkAuth(...Object.values(Role)), eventController.getEvents)



// update route 
route.patch('/update-event/:id', multerUpload.single('file'), validateRequest(updateEventZod), checkAuth(Role.ADMIN), eventController.updateEvents)









export const EventRoute = route