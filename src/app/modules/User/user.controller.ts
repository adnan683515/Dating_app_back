import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import  httpStatus  from 'http-status-codes';




// create a user
const createUser = catchAsync(async (req : Request, res : Response, next : NextFunction)=>{


    const user = await userService.usercreate(req?.body)


    sendResponse(res, {
        statusCode : httpStatus.CREATED, 
        success : true , 
        message : "user Created Successfully!", 
        data : user
    })
})





export  const userController = {
    createUser
}