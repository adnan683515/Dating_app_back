import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes'
import { eventService } from "./event.service";




const createEvent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {



    req.body.user = req?.user?.id

    const data = await eventService.createEvent(req?.body)

    sendResponse(res, {
        message: "Event Create Successfully!",
        success: true,
        statusCode: httpStatus.CREATED,
        data: data
    })
})


export const eventController = {
    createEvent
}