import { z } from "zod";
import { Types } from "mongoose";
import { EventTags } from "./event.interface";

const objectIdValidation = z.string().refine((id) => Types.ObjectId.isValid(id), {
    message: "Invalid ObjectId"
});

const time12HourRegex =  /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;

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

    tags: z
        .array(z.nativeEnum(EventTags)) // array of enum values
        .nonempty("At least one tag is required") // at least 1 tag
        .refine((arr) => new Set(arr).size === arr.length, {
            message: "Duplicate tags are not allowed", // prevent duplicates
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

    // startTime: z
    //     .string()
    //     .regex(time12HourRegex, "Time must be in 12 hour format (e.g. 06:30 PM)"),

    // endTime: z
    //     .string()
    //     .regex(time12HourRegex, "Time must be in 12 hour format (e.g. 09:30 PM)"),

    // openDoor: z
    //     .string()
    //     .regex(time12HourRegex, "Time must be in 12 hour format (e.g. 06:00 PM)"),



  openDoor: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Open door time must be a valid ISO date string (e.g. 2026-03-07T15:20:00.000Z)",
    }),

  startTime: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Start time must be a valid ISO date string (e.g. 2026-03-07T15:20:00.000Z)",
    }),

  endTime: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "End time must be a valid ISO date string (e.g. 2026-03-07T17:20:00.000Z)",
    }),

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




export const updateEventZod = z.object({
  title: z
    .string()
    .min(8, "Title must be at least 8 characters")
    .max(50, "Title cannot exceed 50 characters")
    .trim()
    .optional(),

  fee: z
    .coerce.number({message : "Event fee must be a number" })
    .min(0, "Fee must be a positive number")
    .optional(),

  category: objectIdValidation.optional(),

  lat: z
    .coerce.number({ message: "Latitude must be a number" })
    .optional(),

  long: z
    .coerce.number({ message: "Longitude must be a number" })
    .optional(),

  tags: z
    .array(z.nativeEnum(EventTags), { message: "Tags must be an array of valid values" })
    .nonempty("At least one tag is required")
    .refine((arr) => new Set(arr).size === arr.length, {
      message: "Duplicate tags are not allowed",
    })
    .optional(),

    // status : z.string(),

  start_date: z.string({ message: "Start date is required" }).optional(),
  end_date: z.string({ message: "End date is required" }).optional(),

  // startTime: z
  //   .string()
  //   .regex(time12HourRegex, "Start time must be in 12 hour format (e.g. 06:30 PM)")
  //   .optional(),

  // endTime: z
  //   .string()
  //   .regex(time12HourRegex, "End time must be in 12 hour format (e.g. 09:30 PM)")
  //   .optional(),

  // openDoor: z
  //   .string()
  //   .regex(time12HourRegex, "Open door time must be in 12 hour format (e.g. 06:00 PM)")
  //   .optional(),



  openDoor: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Open door time must be a valid ISO date string (e.g. 2026-03-07T15:20:00.000Z)",
    }),

  startTime: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Start time must be a valid ISO date string (e.g. 2026-03-07T15:20:00.000Z)",
    }),

  endTime: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "End time must be a valid ISO date string (e.g. 2026-03-07T17:20:00.000Z)",
    }),

  image: z.string().optional(),

  descripton: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  eventlineup: z
    .array(objectIdValidation)
    .max(10, "Event lineup cannot have more than 10 entries")
    .optional(),
});