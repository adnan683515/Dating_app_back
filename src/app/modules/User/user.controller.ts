import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";





const createUser = catchAsync(async (req : Request, res : Response, next : NextFunction)=>{


    console.log("user data from body", req?.body)

    const user = await userService.usercreate(req?.body)


    res.send({data : "data get", req : req.body})
})


export  const userController = {
    createUser
}