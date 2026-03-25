import AppError from "../../errorHerlpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { lineupSearchAble } from "./lineup.constant";
import { IEventLineup } from "./lineup.interface";
import { EventLineUp } from "./lineup.model";
import httpStatus from 'http-status-codes'


// create lineup
const lineupCreate = async (payload: any) => {

    const { eventId, lineups } = payload

    // name গুলো collect করা
    const names = lineups.map((item: any) => item.name)

    // already exist check
    const existing = await EventLineUp.find({
        name: { $in: names }
    })

    if (existing.length > 0) {
        throw new AppError(httpStatus.BAD_REQUEST, "Some lineup already exists")
    }

    // eventId add করা
    const data = lineups.map((item: any) => ({
        name: item.name,
        eventId
    }))

    const created = await EventLineUp.insertMany(data)


    
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