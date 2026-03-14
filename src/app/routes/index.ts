import { Router } from "express";
import { UserRoutes } from "../modules/User/user.route";
import { authRoutes } from "../modules/auth/auth.routes";
import { InterestRouter } from "../modules/Interest/interest.route";
import { LineupRoute } from "../modules/EventLineup/lineup.route";
import { CetegoryRoute } from "../modules/ICategory/cetegory.route";
import { ConnectionRouter } from "../modules/ConnectionRequest/connection.route";
import { EventRoute } from "../modules/Events/event.route";
import { PostRoute } from "../modules/Post/post.route";
import { CommentRoute } from "../modules/Comments/comment.route";
import { LikeRoute } from "../modules/Like/like.route";
import path from "node:path";
import { MessageRoute } from "../modules/Message/message.route";
import { BookingRouter } from "../modules/Booking/booking.route";



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
    }, {
        path : '/comment', 
        route : CommentRoute
    },{
        path:'/like',
        route : LikeRoute

    },{
        path : '/message',
        route : MessageRoute
    },
    {
        path : "/booking",
        route : BookingRouter
    }
]


moduleRoutes.forEach((route)=>{
    router.use(route.path , route.route)
})