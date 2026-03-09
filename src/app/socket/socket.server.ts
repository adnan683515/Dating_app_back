import { Server } from "socket.io";

let io: Server


export const initSocket = async (httpServer: any) => {

    io = new Server(httpServer, {
        cors: {
            origin: "*"
        }
    })


    io.on("connection", (socket) => {

        console.log("socket connected", socket.id)

        socket.on("disconnect", () => {
            console.log("socket disconnect")
        })
    })


}



export const getIO = () => {
    return io
}