import { Schema, Types } from "mongoose";
import { Icomment } from "./comments.interface";



const schema = new Schema<Icomment>({

    userId : {type : Types.ObjectId , ref : 'User', required : true}

})