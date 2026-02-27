import { model, Schema } from "mongoose";
import { IAuthProvider, IUser, Role, Status } from "./user.interface";


const authProviderSchema = new Schema<IAuthProvider>({
    provider: { type: String, required: true },
    providerId: { type: String, required: true }
}, {
    versionKey: false,
    _id: false
})

const userSchema = new Schema<IUser>({
    displayName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.USER
    },
    age: { type: Number },
    bio: { type: String },

    availableForDate: { type: Boolean, default: false },
    availableForDance: { type: Boolean, default: false },
    availableForFriend: { type: Boolean, default: false },

    lat: { type: Number },
    long: { type: Number },

    status : {type : String , default : Status.ACTIVE}, 

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


export const User = model<IUser>("User", userSchema)


// displayName : string;
// email : string;
// age? : number;
// image? : string;
// password? : string;
// bio? : string;
// availableForDate ? : boolean;
// availableForDance ? : boolean;
// availableForFriend ? : boolean;
// lat ? : string;
// long ? : string;
// interests? : Types.ObjectId[];
// role : Role;
// auths : IAuthProvider[]