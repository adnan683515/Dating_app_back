import { Types } from "mongoose";






export interface postInterface {

    _id? : Types.ObjectId,
    imageOrVideo : string,
    caption : string,
    description : string,
    location : string,
    userId : Types.ObjectId
}