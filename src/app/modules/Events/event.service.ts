import htttpStatus from 'http-status-codes';
import AppError from "../../errorHerlpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { EStatus, IEvent } from "./event.interface";
import { Event } from "./event.model";
import { Cetegory } from '../ICategory/cetegory.model';





// event create only admin create events
const createEvent = async (payload: Partial<IEvent>) => {

    const { category, ...rest } = payload


    const isCategoryExits = await Cetegory.findById(category)

    if (!isCategoryExits) {
        throw new AppError(htttpStatus.NOT_FOUND, "This category was not found")
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
const getEvents = async ( lat : Number , long : Number , quey: Record<string, string>) => {




    let baseQuery: any = {
        status: { $nin: [EStatus.END, EStatus.CANCELLED] },
        isDelete: false
    };

    // user location থাকলে geo query add করবো
    if (lat && long) {
        console.log("hey lat long")
        baseQuery.location = {
            $nearSphere: {
                $geometry: {
                    type: "Point",
                    coordinates: [long, lat]
                },
                $maxDistance: 1000
            }
        };
    }



    const queryBuilder = new QueryBuilder( Event.find(baseQuery) , quey)

    const eventsData = queryBuilder.filter().search(['title']).sort().fields().paginate()


    const [data, meta] = await Promise.all([
        eventsData.build(),
        queryBuilder.getMeta()
    ])



    return {
        data,
        meta
    }
}


// update events 
const updateEvents = async (eventId: string, payload: Partial<IEvent>) => {

    const isExitsEvent = await Event.findById(eventId)

    if (!isExitsEvent) {
        throw new AppError(htttpStatus.NOT_FOUND, "This Event not found!")
    }


    const updatedEvent = await Event.findByIdAndUpdate(
        { _id: eventId },
        { $set: payload }, {
        returnDocument: "after", runValidators: true
    }
    )

    return updatedEvent

}


export const eventService = {
    createEvent,
    getEventDetails,
    getEvents,
    updateEvents
}