import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { connectionSerivce } from "./connection.service";






const connectionSend = catchAsync(async (req : Request, res :  Response, next : NextFunction)=>{


    const result = await connectionSerivce.connectionSend(req?.body)

    
})