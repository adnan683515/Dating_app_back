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



const getAllMessages = catchAsync(async (req:Request, res : Response , next : NextFunction) => {

    const { roomId } = req.params 
    const query = req?.query 
    const messages = await messageService.getAllMessages(roomId as string , query as Record<string,string>)

    messages.meta.total = messages?.data?.length

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