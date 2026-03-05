import { Router } from "express";
import { connectionController } from "./connection.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import { validateRequest } from "../../middlewares/ValidateRequest";
import { connectionSendZod } from "./connection.validation";





const route = Router()


// send connection requst
route.post('/connection-request', validateRequest(connectionSendZod), checkAuth(...Object.values(Role)), connectionController.connectionSend)



export const ConnectionRouter = route