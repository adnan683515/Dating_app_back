import { Server } from "http";
import mongoose from "mongoose";
import  express  from "express";
import dotenv from 'dotenv'
dotenv.config()



let server : Server
const app = express()

const startServer =async ()=>{
    console.log(process.env.DB_URL as string)
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