import { Types } from "mongoose";




export interface IEventLineup {
    _id?: Types.ObjectId;
    name: string;
    isDelete? : true;
    eventId : Types.ObjectId
} 