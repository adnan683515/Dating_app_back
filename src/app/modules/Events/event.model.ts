import { model, Schema, Types } from "mongoose";
import { EStatus, EventTags, IEvent } from "./event.interface";


export const EventSchema = new Schema<IEvent>({
    title: {
        type: String,
        required: [true, "Event title is required"],
        trim: true,
        maxlength: [50, "Title cannot exceed 50 characters"],
        minlength: [8, "Title must be at least 8 characters"]
    },

    fee: {
        type: Number,
        required: [true, "Event fee is required"],
        // min: [0, "Fee must be a positive number"]  // positive only
    },

    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // event creator only admin

    category: { type: Schema.Types.ObjectId, ref: "Cetegory", required: true },

    lat: { type: Number, required: [true, "Latitude is required"] },
    long: { type: Number, required: [true, "Longitude is required"] },

    start_date: { type: Date, required: [true, "Start date is required"] },
    end_date: { type: Date, required: [true, "End date is required"] },

    startTime: { type: Date, required: [true, "Start time is required"] }, // "18:30"
    endTime: { type: Date, required: [true, "End time is required"] },       // "21:30"
    openDoor: { type: Date, required: [true, "Open door time is required"] }, // "18:00"



    status: { type: String, enum: [...Object.values(EStatus)], default: EStatus.NOSTART },

    image: { type: String, default: "" },

    tags: {
        type: [String],             // it's an array of strings
        enum: Object.values(EventTags), // only allow these enum values
        required: true,             // must have at least one tag
        validate: [(val: string[]) => val.length > 0, 'At least one tag is required']
    },
    
    descripton: {
        type: String,
        default: "",
        maxlength: [500, "Description cannot exceed 500 characters"]
    },

    eventlineup: [
        {
            type: Schema.Types.ObjectId,
            ref: "EventLineUp",
            default: [],
            validate: {
                validator: function (arr: Types.ObjectId[]) {
                    return arr.length <= 10; // max 10 elements
                },
                message: "Event lineup cannot have more than 10 entries"
            }
        }
    ],

    attendanceTotal: { type: Number, default: 0 },
    isDelete: { type: Boolean, default: false }


}, {
    timestamps: true, // createdAt & updatedAt auto add
    versionKey: false
});

// Model
export const Event = model<IEvent>("Event", EventSchema);