import dotenv from 'dotenv';
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { seedAdmin } from './app/utils/seedAdmin';
import { startEventScheduler } from './app/utils/startEventShedular';
dotenv.config()



let server: Server



const startServer = async () => {

    try {
        await mongoose.connect(process.env.DB_URL as string)
        server = app.listen(process.env.PORT, () => {
            console.log(`server is listening on port ${process.env.PORT}`)
        })
    }
    catch (error) {
        console.log(error)
    }
}


// server start
(
    async () => {
        await startServer()
        await seedAdmin()
        startEventScheduler()
    }
)()




// app.get("/", (req: Request, res: Response) => {
//     res.status(httpStatus.OK).json({
//         message: "Welcome To tour Dating App!!.."
//     })

// })


process.on("SIGTERM", () => {
    console.log("SIGTERM signal recieved... Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

process.on("SIGINT", () => {
    console.log("SIGINT signal recieved... Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})


process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejecttion detected... Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception detected... Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

// Unhandler rejection error
// Promise.reject(new Error("I forgot to catch this promise"))

// Uncaught Exception Error
// throw new Error("I forgot to handle this local erro")


/**
 * unhandled rejection error
 * uncaught rejection error
 * signal termination sigterm
 */

