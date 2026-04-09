import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import { reportController } from "./report.controller";




const route = Router()



route.post('/create-report/:type' , checkAuth(...Object.values(Role)) , reportController.createReport)



// get all report post (admin)

route.get('/get-all-post-report' , checkAuth(Role.ADMIN) , reportController.getAllreport)


export const ReportRouter = route