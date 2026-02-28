import { Router } from "express";
import { authController } from "./auth.controller";
import { verify } from './../../../../node_modules/@types/jsonwebtoken/index.d';



const router = Router()

router.post('/login', authController.loginUser)

router.post('/verifiUser', authController.verifyUser )


export const authRoutes = router