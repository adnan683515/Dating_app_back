import { Types } from "mongoose";






export interface postInterface {

    _id? : Types.ObjectId,
    imageOrVideo : string,
    caption : string,
    location : string,
    userId : Types.ObjectId,
    isDelete? : boolean,
    like? : number,
    comment? : number,
}