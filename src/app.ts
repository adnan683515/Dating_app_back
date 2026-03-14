
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors'
import { router } from './app/routes';
import { globalErrorHandler } from './app/middlewares/global.error.handler';
import http from 'http'
import { initSocket } from './app/socket/socket.server';
import { checkAuth } from './app/middlewares/checkAuth';
import { Role } from './app/modules/User/user.interface';
import { bookingController } from './app/modules/Booking/booking.controller';
import rateLimit from 'express-rate-limit';
const app = express()
const server = http.createServer(app)




// web hoook route
app.post("/webhook", (req, res, next) => {
    console.log("Webhook route hit");
    next();
},
    express.raw({ type: "application/json" }), bookingController.webHookController);

initSocket(server)




app.use(express.json())// body theke data accepte korar jonno



app.use(cors()) // frontend theke jno api gula access korte pare
app.use(express.urlencoded({ extended: true }))


app.use("/api/v1", router)



const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 মিনিট
    max: 100, // এই সময়ের মধ্যে max 100 request
    message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);



app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the show');
});



// global error
app.use(globalErrorHandler)


app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Route not found'
    });
});


export default server