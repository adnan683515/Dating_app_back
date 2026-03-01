import { Router } from "express";
import { authController } from "./auth.controller";
import { verify } from './../../../../node_modules/@types/jsonwebtoken/index.d';
import { catchAsync } from "../../utils/catchAsync";
import { Role } from "../User/user.interface";
import { checkAuth } from "../../middlewares/checkAuth";



const router = Router()

router.post('/login', authController.loginUser)

router.post('/verifiUser', authController.verifyUser)

router.patch('/changePassword', checkAuth(...Object.values(Role)), authController.changePassword)


export const authRoutes = router