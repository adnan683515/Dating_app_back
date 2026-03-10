import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { messageService } from "./message.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes'


const sendMessage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const senderId = req?.user?.id 
    const { receiverId, messageText } = req?.body

    console.log("hello boss")
    const sendmsg = await messageService.sendMessage({ senderId,  receiverId, messageText })

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        data : sendmsg,
        message : 'send message successfully!'
    })

})

export const messageController = {
    sendMessage
}