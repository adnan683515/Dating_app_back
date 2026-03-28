import mongoose, { Schema, Types, model } from "mongoose";
import { NotificationInterFace, NotificationTypes } from "./notification.interface";

const notificationSchema = new Schema<NotificationInterFace>(
    {
        receiverId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        type: {
            type: String,
            enum: Object.values(NotificationTypes),
            required: true,
        },

        title: {
            type: String,
        },

        body: {
            type: String,
        },
        eventId: {
            type: Schema.Types.ObjectId,
            ref: "Event",
        },
        requestId: {
            type: Schema.Types.ObjectId,
            ref: "ConnectionReq",
        },
        replyId: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
        },
        postId: {
            type: Schema.Types.ObjectId,
            ref: "Post",
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Notification = model<NotificationInterFace>(
    "Notification",
    notificationSchema
);

export default Notification;