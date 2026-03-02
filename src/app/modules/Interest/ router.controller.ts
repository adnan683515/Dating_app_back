import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { interestService } from "./interest.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes'




const interestcreate = catchAsync(async (req : Request, res : Response, next : NextFunction)=>{

    const interestResult = await interestService.interestCreate(req?.body)

    sendResponse(res , {
        success : true,
        message : "Interest created successfully!", 
        data : interestResult,
        statusCode : httpStatus.CREATED
    })
})



export const interestController = {
    interestcreate
}