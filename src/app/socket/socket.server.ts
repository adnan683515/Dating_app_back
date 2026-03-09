import { Server } from "socket.io";

export let io: Server


export const initSocket = async (httpServer: any) => {

    io = new Server(httpServer, {
        cors: {
            origin: "*"
        }
    })

    console.log("hey")


    io.on("connection", (socket) => {

        console.log("socket connected", socket.id)

        socket.on("disconnect", () => {
            console.log("socket disconnect")
        })
    })


}


