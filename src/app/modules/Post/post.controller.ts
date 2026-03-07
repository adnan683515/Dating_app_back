import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes'
import { postService } from "./post.service";




// create post
const createPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {



    const payload = req?.body
    payload.userId = req?.user?.id
    payload.imageOrVideo = req?.file?.path


    const post = await postService.postCreate(payload)

    sendResponse(res, {
        success: true,
        message: 'post create successfully!',
        data: post,
        statusCode: httpStatus.CREATED
    })
})

// get post
const getpost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const query = req?.query

    const postdata = await postService.getPosts(query as Record<string, string>)


    sendResponse(res, {
        success: true,
        message: 'Post Retrived successfully!',
        data: postdata,
        statusCode: httpStatus.OK
    })
})


const updatepost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const postId = req?.params.id as string
    req?.file ? req.body.imageOrVideo = req?.file ? req?.file?.path : "" : ''


const user = req?.user?.id as string
   


    const updatedata = await postService.updatePost(postId, req?.body , user)

    sendResponse(res, {
        success: true,
        data: updatedata,
        message: "Update successfully",
        statusCode: httpStatus.OK
    })


})


export const postController = {
    createPost,
    getpost,
    updatepost
}