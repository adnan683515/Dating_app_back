import AppError from "../../errorHerlpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { lineupSearchAble } from "./lineup.constant";
import { IEventLineup } from "./lineup.interface";
import { EventLineUp } from "./lineup.model";
import httpStatus from 'http-status-codes'


// create lineup
const lineupCreate = async (payload: Partial<IEventLineup>) => {

    const { name } = payload

    const lineup = await EventLineUp.findOne({ name: name as string })

    if (lineup) {
        throw new AppError(httpStatus.BAD_REQUEST, "Lineup Already created")
    }
    const created = await EventLineUp.create(payload)

    return created

}



// get lineup
const getLineup = async (query: Record<string, string>) => {



    const queryBuilder = new QueryBuilder(EventLineUp.find(), query)
        .filter()
        .search(lineupSearchAble)
        .sort()
        .fields()
        .paginate()

    const [data, meta] = await Promise.all([
        queryBuilder.build(),
        queryBuilder.getMeta()
    ]);


    return {
        data,
        meta
    }


}



// update line data
const updateLineup = async (userId : string, payload : Partial<IEventLineup>)=>{

    const {...updatedFields} = payload

    const lineup = await EventLineUp.findById(userId)
    if(!lineup){
        throw new AppError(httpStatus.NOT_FOUND, "Lineup Not found!!")
    }

    const updatedData = await EventLineUp.findOneAndUpdate(
        {_id : userId},
        {$set : updatedFields}, 
        {returnDocument : "after", runValidators : true }
    )
    return updatedData

}




export const lineupService = {
    lineupCreate,
    getLineup,
    updateLineup
}