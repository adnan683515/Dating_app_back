import { Server } from "socket.io";

export let io: Server

export const onlineUsers: Record<string, string> = {}
// { userId : socketId }

export const initSocket = async (httpServer: any) => {

    io = new Server(httpServer, {
        cors: {
            origin: "*"
        }
    })


    io.on("connection", (socket) => {

        let userId: string | null = null
        // user join 
        socket.on('join-user', (_userId: string) => {

            userId = _userId
            if (_userId) {
                socket.join(_userId)
                onlineUsers[_userId] = socket.id
                console.log(onlineUsers)
                io.emit("get_online_users", Object.keys(onlineUsers)) // emit kore pathai dilam online users gula k 
            }


        })

        socket.on("disconnect", () => {
            if (userId) {
                delete onlineUsers[userId] // remove kore dilam from online user object theke
                io.emit('get_online_users', Object.keys(onlineUsers));
            }
            console.log("online users", onlineUsers)

        })


    })

}


