import { Router } from "express";
import { UserRoutes } from "../modules/User/user.route";
import { authRoutes } from "../modules/auth/auth.routes";
import { InterestRouter } from "../modules/Interest/interest.route";
import { LineupRoute } from "../modules/EventLineup/lineup.route";
import { CetegoryRoute } from "../modules/ICategory/cetegory.route";
import { ConnectionRouter } from "../modules/ConnectionRequest/connection.route";
import { EventRoute } from "../modules/Events/event.route";
import { PostRoute } from "../modules/Post/post.route";



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
    }, {
        path : "/lineup",
        route : LineupRoute
    }, {
        path : "/cetegory", 
        route : CetegoryRoute
    }, {
        path : '/connection',
        route : ConnectionRouter
    }, {
        path : '/event',
        route : EventRoute
    },{
        path:'/post',
        route : PostRoute
    }
]


moduleRoutes.forEach((route)=>{
    router.use(route.path , route.route)
})