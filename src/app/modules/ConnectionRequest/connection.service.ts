import AppError from "../../errorHerlpers/AppError";
import { User } from "../User/user.model";
import { IConnection } from "./connection.interface";
import httpStatus from 'http-status-codes'






const connectionSend = async (payload: Partial<IConnection>) => {


    const { sendReq, recivedReq, type } = payload

    const senderIsExits = await User.findById(sendReq)
    const receivedReqExits = await User.findById(recivedReq)
    if (!senderIsExits) {
        throw new AppError(httpStatus.NOT_FOUND, "Sender Not found!")
    }
    if (!receivedReqExits) {
        throw new AppError(httpStatus.NOT_FOUND, "Receiveder not found!")
    }


    console.log(senderIsExits, receivedReqExits, type)

    return true
}


export const connectionSerivce = {
    connectionSend
}