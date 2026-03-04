import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { connectionSerivce } from "./connection.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes'





// connection send controller
const connectionSend = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const result = await connectionSerivce.connectionSend(req?.body)

    sendResponse(res, {
        success: true,
        message: "send request successfully!",
        statusCode: httpStatus.CREATED,
        data: result
    })


})



export const connectionController = {
    connectionSend
}