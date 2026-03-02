import AppError from "../../errorHerlpers/AppError";
import { IInterest } from "./interest.interface";
import { Interest } from "./interest.model";
import httpStatus from 'http-status-codes'



const interestCreate = async (payload : Partial<IInterest>)=>{

    const exitsInterest = await Interest.findOne({name : payload.name as string})

    if(exitsInterest){
        throw new AppError(httpStatus.BAD_REQUEST, "This interest already created")
    }

    const interest = await Interest.create({name : payload?.name as string})
    return interest


}

export const interestService = {
    interestCreate
}