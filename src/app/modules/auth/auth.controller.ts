
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { loginService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import http_status_code from "http-status-codes"




// login user 
const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const user = await loginService.loginUser(req?.body)


    sendResponse(res, {
        success: true,
        message: "Login successfully!",
        statusCode: http_status_code.OK,
        data: user
    })

})



//verified controller
const verifyUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    await loginService.verifyuser(req?.body)

    sendResponse(res, {
        statusCode: http_status_code.OK,
        message: "✅ Otp verification successfully",
        success: true
    })
})

export const authController = {
    loginUser,
    verifyUser
}