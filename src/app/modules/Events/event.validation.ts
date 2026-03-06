import { z } from "zod";
import { Types } from "mongoose";

const objectIdValidation = z.string().refine((id) => Types.ObjectId.isValid(id), {
    message: "Invalid ObjectId"
});

const time12HourRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;

export const createEventZod = z.object({
    title: z
        .string()
        .min(8, "Title must be at least 8 characters")
        .max(50, "Title cannot exceed 50 characters")
        .trim(),

    fee: z.coerce
        .number({
            message: "Event fee is required"
        })
        .min(0, "Fee must be a positive number"),

    category: objectIdValidation,

    lat: z.coerce.number({
        message: "Latitude is required"
    }),

    long: z.coerce.number({
        message: "Longitude is required"
    }),

    start_date: z.string({
        message: "Start date is required"
    }),

    end_date: z.string({
        message: "End date is required"
    }),

    startTime: z
        .string()
        .regex(time12HourRegex, "Time must be in 12 hour format (e.g. 06:30 PM)"),

    endTime: z
        .string()
        .regex(time12HourRegex, "Time must be in 12 hour format (e.g. 09:30 PM)"),

    openDoor: z
        .string()
        .regex(time12HourRegex, "Time must be in 12 hour format (e.g. 06:00 PM)"),

    image: z.string().optional(),

    descripton: z
        .string()
        .max(500, "Description cannot exceed 500 characters")
        ,

    eventlineup: z
        .array(objectIdValidation)
        .max(10, "Event lineup cannot have more than 10 entries")
        .optional()
});