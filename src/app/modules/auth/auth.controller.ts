
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { loginService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import http_status_code from "http-status-codes"




const loginUser = catchAsync(async (req : Request, res : Response, next : NextFunction)=>{
    console.log(req?.body)

    const user = await loginService.loginUser(req?.body)

    


    sendResponse(res , {
        success : true,
        message : "Login successfully!", 
        statusCode : http_status_code.OK,
        data : user
    })

})


export const authController = {
    loginUser
}