import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes'
import { eventService } from "./event.service";
import { validateRequest } from "../../middlewares/ValidateRequest";
import { EventSchema } from "./event.model";
import { createEventZod } from "./event.validation";
import AppError from "../../errorHerlpers/AppError";




// event create contoller
const createEvent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {



    req.body.user = req?.user?.id
    req.body.fee = Number(req?.body?.fee)
    req.body.lat = Number(req?.body?.lat)
    req.body.long = Number(req?.body?.long)
    req.body.image = req?.file ? req?.file?.path : ""


    const MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (req?.file) {
        if (req.file.size > MAX_SIZE) {
            throw new AppError(httpStatus.BAD_REQUEST, "File size should not exceed 5MB")
        }
    }



    const data = await eventService.createEvent(req?.body)

    sendResponse(res, {
        message: "Event Create Successfully!",
        success: true,
        statusCode: httpStatus.CREATED,
        data: data
    })
})

const eventDetails = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const data = await eventService.getEventDetails(req?.params?.id as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Event Retrived successfully!",
        data
    })
})


// get all events 
const getEvents  = catchAsync(async (req : Request , res : Response , next : NextFunction)=>{


    const query = req?.query
    const events = await eventService.getEvents(query as Record<string,string>)


    sendResponse(res , {
        success : true, 
        message : "Get All Events", 
        data : events, 
        statusCode : httpStatus.OK
    })
})


export const eventController = {
    createEvent,
    getEvents,
    eventDetails
}