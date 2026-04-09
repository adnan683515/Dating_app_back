import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { reportService } from "./report.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes'
import AppError from "../../errorHerlpers/AppError";


const createReport = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const types = req?.params?.type
    if (!types) {
        throw new AppError(httpStatus.NOT_FOUND, "Please give me type of report")
    }
    req.body.type = types
    req.body.reporter = req?.user?.id


    const data = await reportService.createReport(req?.body)


    sendResponse(res, {
        data: data,
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Report create successfully!'
    })


})



// get all report post 
const getAllreport = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  
    const query = req?.query

    const data = await reportService.getAllPostreport(query as Record<string, string> )


    sendResponse(res, {
        data: data,
        success: true,
        message: 'All report post',
        statusCode: httpStatus.OK
    })
})


export const reportController = {
    createReport,
    getAllreport
}