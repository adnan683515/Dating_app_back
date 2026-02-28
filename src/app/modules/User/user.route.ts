import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/ValidateRequest";
import { createUserZodSchema } from "./user.validation";








const router = Router()


// user registration route
router.post('/register', validateRequest(createUserZodSchema), userController.createUser)





export const UserRoutes = router