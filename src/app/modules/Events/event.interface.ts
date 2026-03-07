import { Types } from "mongoose";



export enum EStatus {
    NOSTART = "NOSTART",
    OPPENDOOR = "OPEN DOOR",
    GOING = "GOING",
    END = "END",
    CANCELLED = "CANCELLED"
}


export enum EventTags {
    VIP = "VIP",
    NEARBY = "NEARBY",
    ROOFTOP = "ROOFTOP",
    OUTDOOR = "OUTDOOR"
}


export interface IEvent {

    _id?: Types.ObjectId;
    title: string;
    fee: Number; //event fee
    user: Types.ObjectId; //who create this event(Only admin)
    category: Types.ObjectId; //event cetegory

    lat: Number;
    long: Number;

    start_date: Date;
    end_date: Date;

    startTime: Date; // "18:30"
    endTime: Date;   // "21:30"
    openDoor: Date; // "18:00"

    status: EStatus;

    tags: EventTags[];

    image: string;
    descripton: string;

    eventlineup: Types.ObjectId[];

    attendanceTotal: number

    isDelete?: boolean
}