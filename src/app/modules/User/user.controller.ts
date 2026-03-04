import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes';
import { JwtPayload } from "jsonwebtoken";
import { IUser, Role, Status } from "./user.interface";
import AppError from "../../errorHerlpers/AppError";




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



    if (req?.body?.password) {
        throw new AppError(httpStatus.BAD_REQUEST, "This is not permitted!")
    }
    if (req?.user?.role === Role?.USER && req?.body?.role) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Users are not allowed to change their role."
        );
    }

    if (req?.user?.role === Role?.ADMIN && (req?.body?.role === Role?.ADMIN || req?.body?.role == Role?.USER)) {
        throw new AppError(httpStatus.BAD_REQUEST, "Admins cannot modify their own role.");
    }

    if (req?.user?.role === Role?.USER && req?.body?.status) {
        throw new AppError(httpStatus.BAD_REQUEST, "Users are not allowed to change their status.");
    }


    const payload: IUser = {
        ...req.body,
        image: req.file?.path
    }

    const imageUrl = payload?.image

    if (req.file) {

    
        if (req.file.size > 2 * 1024 * 1024) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                "File size must be less than 2MB"
            );
        }

        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

        if (!allowedTypes.includes(req.file.mimetype)) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                "Only PNG, JPG, and JPEG are allowed"
            );
        }
    }



    const userId = req?.params?.id as string
    const updatedUserInfo = await userService.updateUser(userId, payload)

    sendResponse(res, {
        success: true,
        message: "✅ updated successfully!",
        statusCode: httpStatus.OK,
        data: updatedUserInfo
    })
})


// get all users with out admin
const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const query = req?.query


    const users = await userService.getAllUsers(query as Record<string, string>)


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Get All Users",
        data: users
    })
})


// get me
const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const decodedToken = req?.user as JwtPayload
    const user = await userService.getMe(decodedToken?.id)

    sendResponse(res, {
        success: true,
        message: "Your profile Retrieved Successfully",
        data: user,
        statusCode: httpStatus.OK
    })
})


// get singleUser
const singleUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req?.params?.id as string

    const user = await userService.singleUser(id)
    sendResponse(res, {
        success: true,
        message: "User Details Retrived Successfully",
        data: user,
        statusCode: httpStatus.OK
    })
})



export const userController = {
    createUser,
    updateUser,
    getAllUsers,
    getMe,
    singleUser
}