import { Types } from "mongoose";



export enum EStatus {
    NOSTART="nostart",
    GOING="going",
    END="end",
    CANCELLED="cancelled"
}



export interface IEvent {

    _id? : Types.ObjectId;
    title : string;
    fee : number; //event fee
    user : Types.ObjectId; //who create this event(Only admin)
    category : Types.ObjectId;

    lat : string;
    long : string;

    start_date : string;
    end_date : string;

    status : EStatus;
    image : string;
    descripton : string;

    eventlineup : Types.ObjectId[];
    eventAttendance : Types.ObjectId[]
}