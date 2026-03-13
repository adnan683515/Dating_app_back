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

    // GeoJSON location for geospatial queries
    location: {
        type: "Point";
        coordinates: [number, number]; // [long, lat]
    };


    start_date_time: Date;
    end_date_time: Date;
    openDoor: Date;


    // startTime: Date;
    // endTime: Date;
    venue : string;


    serviceFee : number;
    status: EStatus;

    tags: EventTags[];

    image: string;
    descripton: string;

    attendanceTotal: number;
    lineupMember? : number;

    isDelete?: boolean
}