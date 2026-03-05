import { model, Schema } from "mongoose";
import { IAuthProvider, IOTP, IUser, Role, Status } from "./user.interface";




const authProviderSchema = new Schema<IAuthProvider>({
    provider: { type: String, required: true },
    providerId: { type: String, required: true }
}, {
    versionKey: false,
    _id: false
})


const userSchema = new Schema<IUser>({
    displayName: { type: String, required: true , trim : true },
    email: { type: String, required: true, unique: true },
    password: { type: String, trim : true },
    image: { type: String, default: "" },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.USER
    },
    age: { type: Number },
    bio: { type: String, default: "" , trim : true },

    availableForDate: { type: Boolean, default: false },
    availableForDance: { type: Boolean, default: false },
    availableForFriend: { type: Boolean, default: false },

    newMatchesNotification: { type: Boolean, default: true },
    messageAlertsNotification: { type: Boolean, default: true },
    eventRemindersNotification: { type: Boolean, default: true },

    isVerified: { type: Boolean, default: false },

    lat: { type: Number },
    long: { type: Number },

    status: { type: String, default: Status.ACTIVE },

    interests: [{
        type: Schema.Types.ObjectId,
        ref: "Interest",
        default: []
    }
    ],
    


    auths: [authProviderSchema]
}, {
    timestamps: true,
    versionKey: false
})



const otpSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim : true
    },

    otp: {
        type: String,
        required: true,
        trim :true
    },

    expiresAt: {
        type: Date,
        required: true,
    },
}, {
    versionKey : false
})




export const User = model<IUser>("User", userSchema)
export const OTP = model<IOTP>("OTP", otpSchema)

