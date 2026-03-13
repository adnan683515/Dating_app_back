import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes';
import { JwtPayload } from "jsonwebtoken";
import { IUser, Role, Status } from "./user.interface";
import AppError from "../../errorHerlpers/AppError";
import sharp from "sharp";
import { uploadToCloudinary } from "../../config/multer.config";





// create a user
const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { fullName } = req?.body

    const displayName = fullName.split(' ')[0]

    req.body.displayName = displayName


    await userService.usercreate(req?.body)


    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "✅ Registration Successfully.",
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
    if ((req?.user?.role === Role.USER) && req?.body?.isVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, "User can not modify their varification")
    }



    const booleanFields = [
        "availableForDate",
        "availableForDance",
        "availableForFriend",
        "newMatchesNotification",
        "messageAlertsNotification",
        "eventRemindersNotification"
    ];

    booleanFields.forEach(field => {
        if (req.body[field] !== undefined) {
            req.body[field] = req.body[field] === "true";
        }
    });


    req?.body?.lat ? req.body.lat = Number(req?.body?.lat) : ''
    req?.body?.long ? req.body.long = Number(req?.body?.long) : ''
    req?.body?.age ? req.body.age = Number(req?.body?.age) : ''


    if (req?.body?.age <= 18) {
        throw new AppError(httpStatus.BAD_REQUEST, "You must be at least 18 years old to use this platform.")
    }


    // upload image 
    if (req.file) {

        // compress image
        const compressedImage = await sharp(req.file.buffer)
            .resize({ width: 1200 })
            .jpeg({ quality: 70 })
            .toBuffer()

        // upload cloudinary
        const result: any = await uploadToCloudinary(compressedImage)
        req.body.image = result.secure_url
    }


    const payload: IUser = {
        ...req.body
    }



    if (payload.lat && payload.long) {
        payload.location = {
            type: "Point",
            coordinates: [payload.long, payload.lat] // always [long, lat]
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
    const userId = req?.user?.id


    const users = await userService.getAllUsers(userId as string, query as Record<string, string>)


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