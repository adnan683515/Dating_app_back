import dotenv from 'dotenv';
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { Request, Response } from 'express';
dotenv.config()
import httpStatus from 'http-status-codes';


let server : Server


const startServer =async ()=>{
    
    try{
        await mongoose.connect(process.env.DB_URL as string)
        server = app.listen(process.env.PORT, ()=>{
            console.log(`server is listening on port ${process.env.PORT}`)
        })
    }
    catch(error){
        console.log(error)
    }
}


// server start
(
    async ()=>{
        await startServer()
    }
)()




app.get("/", (req : Request , res : Response)=>{
    res.status(httpStatus.OK).json({
        message : "Welcome To tour Dating App!!.."
    })
    
})