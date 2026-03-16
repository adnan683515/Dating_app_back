import httpStatus from 'http-status-codes';
import mongoose, { Types } from "mongoose";
import AppError from "../../errorHerlpers/AppError";
import { IMessage } from "./message.interface";
import { Message, Room } from "./message.model";
import { io, onlineUsers } from '../../socket/socket.server';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { User } from '../User/user.model';
import admin from "firebase-admin";

// send message service
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


    // message create kora holo
    const message = await Message.create({
        senderId: senderId as Types.ObjectId,
        receiverId: receiverId as Types.ObjectId,
        roomId: roomCk._id,
        messageText: payload.messageText as string
    })

    // receiver ar objectid k string a convert korlam
    let receiver = receiverId.toString()

    // online user tar socket id ta nilam
    const socketId = onlineUsers[receiver] as string


    // if jdi user online a thake
    if (socketId) {
        io.to(socketId).emit('direct_message', message);


        io.to(socketId).emit("new_notification", {
            type: "message",
            senderId: senderId,
            roomId: roomCk._id,
            message: payload.messageText
        })
    } else {
        // user offline -> FCM push
        const user = await User.findById(receiverId); // receiverId from message
        if (user?.fcmToken) {
            const fcmMessage: admin.messaging.Message = {
                token: user.fcmToken,
                notification: { title: "New Message", body: message.messageText },
                data: { senderId: message.senderId.toString() as string, roomId: message.roomId.toString() as string },
            };

            try {
                await admin.messaging().send(fcmMessage);
                console.log("Notification sent");
            } catch (err) {
                console.error("FCM error:", err);
            }
        }
    }



    await Room.findOneAndUpdate(
        { _id: roomCk._id as mongoose.Types.ObjectId },
        {
            lastMessage: payload?.messageText as string
        },
        {
            new: true,
            runValidators: true
        }
    )


    return message
}





// get-all-message
const getAllMessages = async (roomId: string, query: Record<string, string>) => {

    if (!roomId) {
        throw new AppError(400, "roomId required")
    }


    const queryBuilder = new QueryBuilder(Message.find({ roomId: roomId }), query)

    const messagesDat = queryBuilder.filter().sort().fields().paginate().populate([{ path: "senderId", select: 'displayName image' }, { path: "receiverId", select: 'displayName image' }])

    const [data, meta] = await Promise.all([
        messagesDat.build(),
        queryBuilder.getMeta()
    ])
    return {
        data,
        meta
    }
}



export const messageService = {
    sendMessage,
    getAllMessages
}