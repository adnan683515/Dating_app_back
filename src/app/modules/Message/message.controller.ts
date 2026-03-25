import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { messageService } from "./message.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes'

// send message
const sendMessage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const senderId = req?.user?.id
    const { receiverId, messageText } = req?.body

    const sendmsg = await messageService.sendMessage({ senderId, receiverId, messageText })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        data: sendmsg,
        message: 'send message successfully!'
    })

})



const getAllMessages = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { otherUserId } = req.params
    const query = req?.query
    const myId = req?.user?.id
    const messages = await messageService.getAllMessages(myId as string, otherUserId as string, query as Record<string, string>)



    // messages.meta.total = messages?.data?.length as number
    // const limit = Number(req?.query.limit) || 10;
    // messages.meta.totalpage = Math.ceil(messages.meta.total / limit) as number;
    // // Math.ceil(totalDocuments / limit)

    sendResponse(res, {
        success: true,
        statusCode: 200,
        data: messages,
        message: "messages fetched successfully"
    })

})

export const messageController = {
    sendMessage,
    getAllMessages
}