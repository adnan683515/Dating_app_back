import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import { eventController } from "./event.controller";
import { validateRequest } from "../../middlewares/ValidateRequest";
import { createEventZod } from "./event.validation";
import { multerUpload } from "../../config/multer.config";





const route = Router()


// event created
route.post('/create-event',  multerUpload.single("file"), validateRequest(createEventZod), checkAuth(Role.ADMIN), eventController.createEvent)




export const EventRoute = route