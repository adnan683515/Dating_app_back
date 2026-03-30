import { Notification } from "../modules/Notifications/notification.model";




export const createNotification = async ({receiverId, senderId,type, title,body}: any) => {



    const notification = await Notification.create({receiverId, senderId,type, title, body});

    

    return notification;
};