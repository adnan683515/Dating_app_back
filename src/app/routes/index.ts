import { Router } from "express";
import { UserRoutes } from "../modules/User/user.route";
import { authRoutes } from "../modules/auth/auth.routes";
import { InterestRouter } from "../modules/Interest/interest.route";



export const router = Router()


const moduleRoutes = [

    {
        path : "/user", 
        route : UserRoutes
    }, {
        path:"/auth",
        route : authRoutes
    }, 
    {
        path : '/interest',
        route : InterestRouter
    }
]


moduleRoutes.forEach((route)=>{
    router.use(route.path , route.route)
})