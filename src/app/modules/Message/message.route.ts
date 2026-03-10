import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import { messageController } from "./message.controller";






const route = Router()

route.post('/sendMessage', checkAuth(...Object.values(Role)) , messageController.sendMessage)



export const MessageRoute = route