import { Router } from "express";
import { connectionController } from "./connection.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";





const route = Router()


// send connection requst
route.post('/connection-request', checkAuth(...Object.values(Role)), connectionController.connectionSend)



export const ConnectionRouter = route