
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { loginService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import http_status_code from "http-status-codes"
import { clearTokens, setTokens } from "../../utils/UserTokens";




// login user 
const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const user = await loginService.loginUser(req?.body)

    // set tokens browser cookie
    await setTokens(res, {
        accessToken: user?.accessToken,
        refreshToken: user?.refreshToken
    })

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


//change password when user is authenticated
const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const passChange = await loginService.changePasswordService({ email: req?.user?.email, ...req?.body })

    sendResponse(res, {
        success: true,
        statusCode: http_status_code.OK,
        message: "password change successfully"

    })
})


//logout 
const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    await clearTokens(res)

    sendResponse(res, {
        success: true,
        message: "Logout Successfully!",
        statusCode: http_status_code.OK
    })
})






export const authController = {
    loginUser,
    verifyUser,
    changePassword,
    logout

}