import AppError from "../../errorHerlpers/AppError";
import { IInterest } from "./interest.interface";
import { Interest } from "./interest.model";
import httpStatus from 'http-status-codes'



const interestCreate = async (payload: Partial<IInterest>) => {

    const exitsInterest = await Interest.findOne({ name: payload.name as string })

    if (exitsInterest) {
        throw new AppError(httpStatus.BAD_REQUEST, "This interest already created")
    }

    const interest = await Interest.create({ name: payload?.name as string })
    return interest


}



// get all interest
const interests = async (query: Record<string, string>) => {


    const filter = query
    const searchTerm = filter?.searchTerm || ""


    const data = await Interest.find({
        name: { $regex: searchTerm as string, $options: "i" }
    })


    return data
}

export const interestService = {
    interestCreate,
    interests
}