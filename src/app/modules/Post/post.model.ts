import { model, Schema } from "mongoose";
import { postInterface } from "./post.interface";





const postSchema = new Schema<postInterface>({
    imageOrVideo: {
        type: String,
        required: [true, "Image or Video is required"],
    },
    caption: {
        type: String,
        required: [true, "Caption is required"],
        trim: true,
        minlength: [5, "Caption must be at least 5 characters long"],
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isDelete : {type : Boolean , default : false},
    location: {
        type: String,
        required: true,
        default: "",
    },
}, { timestamps: true, versionKey: false });

export const Post = model<postInterface>("Post", postSchema)