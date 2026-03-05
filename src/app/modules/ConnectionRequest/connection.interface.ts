import { Types } from "mongoose";


export enum StatusConnect {
    PENDING = "PENDING",
    DECLINE = "DECLINE",
    ACCEPTED = "ACCEPTED"
}


export enum ConnectTypes {
    DANCE = "DANCE",
    DATE = "DATE",
    FRIEND = "FRIEND"
}

export interface IConnection {

    sendReq?: Types.ObjectId;
    recivedReq: Types.ObjectId;
    status: StatusConnect,
    type : ConnectTypes

}