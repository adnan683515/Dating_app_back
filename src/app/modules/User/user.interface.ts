import { Types } from "mongoose";


// dateing role
export enum Role {
    ADMIN = "ADMIN", 
    USER = "USER"
}

// auth providers
export interface IAuthProvider {
    provider : "google" | "credentials";
    providerId : string
}

export interface IUser {
    _id? : Types.ObjectId;
    displayName : string; 
    email : string;
    age? : number;
    image? : string;
    password? : string;
    bio? : string;

    availableForDate ? : boolean;
    availableForDance ? : boolean;
    availableForFriend ? : boolean;

    newMatches ? : boolean; 
    eventReminders? : boolean;
    messageAlerts ? : boolean;


    lat ? : number;
    long ? : number;

    interests? : Types.ObjectId[];

    role : Role;
    auths : IAuthProvider[];
}