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


// user status
export enum Status {
    ACTIVE = "ACTIVE", 
    INACTIVE = "INACTIVE"
}

export interface IUser {
    _id? : Types.ObjectId;
    displayName : string; 
    email : string;
    age? : number;
    image? : string;
    password? : string;
    bio? : string;

    availableForDate ? : boolean; // user date ar jonno prepared kina ..
    availableForDance ? : boolean; // dance ar jonno ?
    availableForFriend ? : boolean;  // friend ar jonno

    newMatches ? : boolean; 
    eventReminders? : boolean;  //when admin create an event ... this event notification send all user .jaden eventReminders true kora ase
    messageAlerts ? : boolean;  // jkhn message alert true kora ase tkhn ..every message a notification jabe


    lat ? : number;  
    long ? : number;

    interests? : Types.ObjectId[];   

    status : Status;

    role : Role;
    auths : IAuthProvider[];
}