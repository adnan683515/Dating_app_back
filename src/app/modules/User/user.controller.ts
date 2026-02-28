import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes';




// create a user
const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    await userService.usercreate(req?.body)


    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "✅ Message sent successfully!",
    })
})


// update use

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    console.log(req, "request")


    const userId = req?.params?.id as string
    const updatedUserInfo = await userService.updateUser(userId, req?.body)

    sendResponse(res, {
        success: true,
        message: "✅ updated successfully!",
        statusCode: httpStatus.OK,
        data: updatedUserInfo
    })
})





export const userController = {
    createUser,
    updateUser
}