import AppError from "../../errorHerlpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { IEvent } from "./event.interface";
import { Event } from "./event.model";
import htttpStatus from 'http-status-codes'





// event create only admin create events
const createEvent = async (payload: Partial<IEvent>) => {

    const { title, ...rest } = payload

    const isExitsEvent = await Event.findOne({ title: title as string })

    if (isExitsEvent) {
        throw new AppError(htttpStatus.BAD_REQUEST, "This Event Already Created!")
    }

    const creatEvent = await Event.create(payload)

    return creatEvent

}


// event details 
const getEventDetails = async (id: string) => {

    const isExitsEvent = await Event.findById(id)
    if (!isExitsEvent) {
        throw new AppError(htttpStatus.NOT_FOUND, "This event not found!")
    }
    return isExitsEvent
}


// get all events
const getEvents = async (quey: Record<string, string>) => {



    const queryBuilder = new QueryBuilder(Event.find(),quey)

    const eventsData = queryBuilder.filter().search(['title']).sort().fields().paginate()


    const [data,meta] = await Promise.all([
        eventsData.build(),
        queryBuilder.getMeta()
    ])
    return {
        data , 
        meta
    }
}


export const eventService = {
    createEvent,
    getEventDetails,
    getEvents
}