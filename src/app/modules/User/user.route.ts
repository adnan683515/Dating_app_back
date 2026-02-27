import { Router } from "express";
import { userController } from "./user.controller";








const router = Router()


// user registration route
router.post('/register', userController.createUser)



export const UserRoutes = router