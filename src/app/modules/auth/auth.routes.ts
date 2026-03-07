import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import { authController } from "./auth.controller";



const router = Router()

router.post('/login', authController.loginUser)

router.post('/verifyUser', authController.verifyUser)

router.patch('/changePassword', checkAuth(...Object.values(Role)), authController.changePassword)

router.post('/logout', checkAuth(...Object.values(Role)),  authController.logout)


export const authRoutes = router