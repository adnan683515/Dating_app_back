import AppError from "../../errorHerlpers/AppError";
import { IEvent } from "./event.interface";
import { Event } from "./event.model";
import htttpStatus from 'http-status-codes'





const createEvent = async (payload: Partial<IEvent>) => {

    const { title, ...rest } = payload

    const isExitsEvent = await Event.findOne({ title: title as string })

    if (isExitsEvent) {
        throw new AppError(htttpStatus.BAD_REQUEST, "This Event Already Created!")
    }

    const creatEvent = await Event.create(payload)

    return creatEvent

}

export const eventService = {
    createEvent
}