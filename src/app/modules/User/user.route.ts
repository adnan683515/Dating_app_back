import { Router } from "express";
import { validateRequest } from "../../middlewares/ValidateRequest";
import { userController } from "./user.controller";
import { createUserZodSchema, updatedUserSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";








const router = Router()


// user registration route
router.post('/register', validateRequest(createUserZodSchema), userController.createUser)


// update user route
router.patch('/updateuser/:id', validateRequest(updatedUserSchema), checkAuth(...Object.values(Role)), userController.updateUser)


//get all users
router.get('/users', userController.getAllUsers)

// get me
router.get('/getMe', checkAuth(...Object.values(Role)) , userController.getMe)


// get single user
router.get('/singleUser/:id', checkAuth(...Object.values(Role)) , userController.singleUser)




export const UserRoutes = router