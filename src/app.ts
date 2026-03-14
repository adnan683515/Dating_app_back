
import cors from 'cors';
import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import http from 'http';
import { globalErrorHandler } from './app/middlewares/global.error.handler';
import { bookingController } from './app/modules/Booking/booking.controller';
import { router } from './app/routes';
import { initSocket } from './app/socket/socket.server';
const app = express()
const server = http.createServer(app)




// web hoook route
app.post("/webhook", (req, res, next) => {
    console.log("Webhook route hit");
    next();
},
    express.raw({ type: "application/json" }), bookingController.webHookController);

initSocket(server) //socket ta initialize korlam




app.use(express.json())// body theke data accepte korar jonno



app.use(cors()) // frontend theke jno api gula access korte pare
app.use(express.urlencoded({ extended: true }))


app.use("/api/v1", router) //main router 



const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 140, // ai time ar modde maximum 140 ta request dite parbe
    message: "Too many requests from this IP, please try again later.",
});

app.use(limiter); //this middleware -> limit request



app.get('/', (req: Request, res: Response) => {
    res.send('Welcome To tour Dating App!!..');
});



// global error
app.use(globalErrorHandler)


app.use((req, res, next) => { // ths middleware-> not found route when user click on unknown route this will be work
    res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Route not found'
    });
});


export default server