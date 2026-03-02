import { Router } from "express";
import { interestController } from "./ router.controller";
import { validateRequest } from "../../middlewares/ValidateRequest";
import { createInterestZod } from "./interest.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";




const router = Router()


router.post('/create-interest', validateRequest(createInterestZod), checkAuth(Role.ADMIN) ,  interestController.interestcreate)


export const InterestRouter = router