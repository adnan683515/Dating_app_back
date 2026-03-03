import AppError from "../../errorHerlpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { interestSearchAble } from "./interest.constant";
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


    // const filter = query
    // const searchTerm = filter?.searchTerm || ""

    const queryBuilder = new QueryBuilder(Interest.find(), query)

    const interestData = queryBuilder
        .search(interestSearchAble)
        .paginate()
        

    const [data, meta] = await Promise.all([
        interestData.build(),
        queryBuilder.getMeta()
    ])


    // const data = await Interest.find({
    //     name: { $regex: searchTerm as string, $options: "i" }
    // })


    return {
        data,
        meta
    }
}

export const interestService = {
    interestCreate,
    interests
}