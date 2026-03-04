import AppError from "../../errorHerlpers/AppError";
import { User } from "../User/user.model";
import { ConnectTypes, IConnection, StatusConnect } from "./connection.interface";
import httpStatus from 'http-status-codes'
import { ConnectionReq } from "./connection.model";






const connectionSend = async (payload: Partial<IConnection>) => {


    const { sendReq, recivedReq, type } = payload

    const senderIsExits = await User.findById(sendReq)
    const receivedReqExits = await User.findById(recivedReq)

    // ck user 
    if (!senderIsExits) {
        throw new AppError(httpStatus.NOT_FOUND, "Sender Not found!")
    }
    if (!receivedReqExits) {
        throw new AppError(httpStatus.NOT_FOUND, "Receiveder not found!")
    }

    const requestExists = await ConnectionReq.findOne({
        $or: [
            { sendReq, recivedReq },
            { sendReq: recivedReq, recivedReq: sendReq }
        ],

    } as any);

    if (requestExists) {
        const status = requestExists?.status
        const message =
            status === StatusConnect.PENDING
                ? "Connection request is already pending."
                : status === StatusConnect.ACCEPTED
                    ? "You are already connected with this user."
                    : "This connection request was declined.";

        throw new AppError(httpStatus.BAD_REQUEST, message)
    }




    // cheack available connection
    if (type === ConnectTypes.DATE && receivedReqExits?.availableForDate === false) {
        throw new AppError(httpStatus.BAD_REQUEST, "This user is not available for a date");
    } else if (type === ConnectTypes.DANCE && receivedReqExits?.availableForDance === false) {
        throw new AppError(httpStatus.BAD_REQUEST, "This user is not available for dancing");
    } else if (type === ConnectTypes.FRIEND && receivedReqExits?.availableForFriend === false) {
        throw new AppError(httpStatus.BAD_REQUEST, "This user is not available for friendship");
    }


    const createConnection = await ConnectionReq.create(payload)

    return createConnection
}


export const connectionSerivce = {
    connectionSend
}