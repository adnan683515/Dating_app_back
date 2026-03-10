import httpStatus from 'http-status-codes';
import { Types } from "mongoose";
import AppError from "../../errorHerlpers/AppError";
import { IMessage } from "./message.interface";
import { Message, Room } from "./message.model";
import { io, onlineUsers } from '../../socket/socket.server';


const sendMessage = async (payload: Partial<IMessage>) => {

    const { senderId, receiverId } = payload

    if (!senderId || !receiverId) {
        throw new AppError(httpStatus.NOT_FOUND, !senderId ? "senderId not found!" : "receiverId not found!")
    }
    const ids = [senderId, receiverId].sort()

    const smallerId = ids[0]
    const largerId = ids[1]

    let roomCk = await Room.findOne({
        user1: smallerId as Types.ObjectId,
        user2: largerId as Types.ObjectId
    })

    if (!roomCk) {

        roomCk = await Room.create({
            user1: smallerId as Types.ObjectId,
            user2: largerId as Types.ObjectId
        })
    }


    const message = await Message.create({
        senderId: senderId as Types.ObjectId,
        receiverId: receiverId as Types.ObjectId,
        roomId: roomCk?._id,
        messageText: payload.messageText as string
    })

    let receiver = receiverId.toString()

    const socketId = onlineUsers[receiver] as string
    console.log("socket id",socketId)

    if (socketId) {
        io.to(socketId).emit('direct_message', message);
    }

}





export const messageService = {
    sendMessage
}