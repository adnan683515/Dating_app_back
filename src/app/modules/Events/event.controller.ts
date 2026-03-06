import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes'
import { eventService } from "./event.service";




const createEvent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {



    req.body.user = req?.user?.id

    console.log(req)

    // const data = await eventService.createEvent(req?.body)

    sendResponse(res, {
        message: "Event Create Successfully!",
        success: true,
        statusCode: httpStatus.CREATED,
        data: true
    })
})


export const eventController = {
    createEvent
}