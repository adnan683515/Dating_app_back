import { model, Schema } from "mongoose";
import { IEventLineup } from "./lineup.interface";



const EventLineUpShcema = new Schema<IEventLineup>({

    name: { type: String, required: true, trim: true, unique: true },
    designation: { type: String, required: true, trim: true },
    isDelete: { type: Boolean, default: false }

}, {
    versionKey: false
})


export const EventLineUp = model<IEventLineup>("EventLineUp", EventLineUpShcema)

