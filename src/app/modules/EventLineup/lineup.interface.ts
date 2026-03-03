import { Types } from "mongoose";




export interface IEventLineup {
    _id?: Types.ObjectId;
    name: string;
    designation: string;
    isDelete? : true;
} 