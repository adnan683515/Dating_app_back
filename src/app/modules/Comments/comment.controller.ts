import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { commentService } from "./comment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes'
import { Types } from "mongoose";



//create-comment controller
const createComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const payload = {
        userId: req?.user?.id,
        ...req?.body
    }


    const data = await commentService.createComment(payload)

    sendResponse(res, {
        data: data,
        success: true,
        message: 'Comment added successfully',
        statusCode: httpStatus.CREATED
    })

})


// get-comments controler
const getComments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const id = req?.params?.id as string

    const query = req?.query
    const data = await commentService.getComments(id, query as Record<string, string>)


    sendResponse(res, {
        data,
        success: true,
        statusCode: httpStatus.OK,
        message: 'get all coments'
    })
})


const updateComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const id = req?.params?.id as string


    const data = await commentService.updateComments(id)

    sendResponse(res, {
        success: true,
        message: "update status done",
        data,
        statusCode: httpStatus.OK
    })


})


const updateCommentsData = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const id = req?.params?.id as string

    const body = req?.body

    const result = await commentService.updateCommentsData(id, body)

    sendResponse(res, {

        success: true,
        message: 'Comment update Successfully',
        data: result,
        statusCode: httpStatus.OK
    })
})




export const commentController = {
    createComment,
    getComments,
    updateComment,
    updateCommentsData
}