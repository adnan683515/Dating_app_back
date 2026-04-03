
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { googleLoginService, loginService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import http_status_code from "http-status-codes"
import { clearTokens, setTokens } from "../../utils/UserTokens";
import AppError from "../../errorHerlpers/AppError";




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


const sendOtpUseingEmail = (async (req: Request, res: Response, next: NextFunction) => {

    const email = req?.params?.email

    const result = await loginService.sendOtpUseingEmail(email as string)


    sendResponse(res, {
        statusCode: http_status_code.OK,
        message: "✅ Otp send your email!",
        success: true,
        data: result
    })

})



const verifyController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const otp = req?.params?.otp
    if (otp !== req?.user?.otp) {
        throw new AppError(http_status_code.BAD_REQUEST, "Otp Doesn't match!")
    }
    sendResponse(res, {
        statusCode: http_status_code.OK,
        message: "✅ verify successfully!",
        success: true,
    })

})




const changePassNewAndConfirm = async (req: Request, res: Response) => {
    const { newpassword, confirmpassword } = req.body;

    // Check if both passwords are provided
    if (!newpassword || !confirmpassword) {
        throw new AppError(http_status_code.BAD_REQUEST, "Both fields are required");
    }

    // Check if passwords match
    if (newpassword !== confirmpassword) {
        throw new AppError(http_status_code.BAD_REQUEST, "Passwords do not match");
    }

    const email = req.user?.email; // assuming you have auth middleware

    await loginService.changePasswordNewAndConfirmed(email, newpassword);



    sendResponse(res, {
        statusCode: http_status_code.OK,
        message: "✅ Password changed successfully",
        success: true,
    })
};







// const googleLoginController = async (req: Request, res: Response) => {
//   try {
//     const { idToken } = req.body;

//     if (!idToken) {
//       return res.status(400).json({ message: "idToken required" });
//     }

//     const result = await googleLoginService(idToken);

//     return res.json(result);
//   } catch (err: any) {
//     return res.status(401).json({
//       message: err.message || "Authentication failed",
//     });
//   }
// };



export const authController = {
    loginUser,
    verifyUser,
    changePassword,
    logout,
    sendOtpUseingEmail,
    verifyController,
    changePassNewAndConfirm

}