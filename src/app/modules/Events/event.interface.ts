import { Types } from "mongoose";



export enum EStatus {
    NOSTART = "NOSTART",
    GOING = "GOING",
    END = "END",
    CANCELLED = "CANCELLED"
}



export interface IEvent {

    _id?: Types.ObjectId;
    title: string;
    fee: number; //event fee
    user: Types.ObjectId; //who create this event(Only admin)
    category: Types.ObjectId; //event cetegory

    lat: number;
    long: number;

    start_date: Date;
    end_date: Date;

    startTime: string; // "18:30"
    endTime: string;   // "21:30"
    openDoor: string; // "18:00"

    status: EStatus;

    image: string;
    descripton: string;

    eventlineup: Types.ObjectId[];

    attendanceTotatl: number
}