import { Types } from "mongoose";
import z from "zod";
import { Role, Status } from "./user.interface";

export const createUserZodSchema = z.object({

    displayName: z.string().min(2, { message: "Name must be at least 2 characters long" }).max(20, { message: "Name must be at most 20 characters long" }),

    email: z.string().email({ message: "Please provide a valid email address" }),

    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
        "Password must be at least 8 characters and include uppercase, lowercase, number and special character").optional()

})



// Updated Zod schema for partial updates 
export const updatedUserSchema = z.object({
    displayName: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." })
        .optional(),

    age: z
        .string()
        .optional(),

    bio: z
        .string()
        .min(5, { message: "Bio must be at least 5 characters long." })
        .max(300, { message: "Bio cannot exceed 300 characters." })
        .optional(),

    image: z.string().optional(),

    availableForDate: z.string().optional(),
    availableForDance: z.string().optional(),
    availableForFriend: z.string().optional(),

    newMatchesNotification: z.string().optional(),
    eventRemindersNotification: z.string().optional(),
    messageAlertsNotification: z.string().optional(),



    lat: z.number().min(-90).max(90).optional(),
    long: z.number().min(-180).max(180).optional(),

    interests: z.preprocess((val) => {
        if (typeof val === "string") {
            try {
                // JSON string array হলে parse করবে
                const parsed = JSON.parse(val);
                return Array.isArray(parsed) ? parsed : [parsed];
            } catch {
                // single string হলে array বানাবে
                return [val];
            }
        }

        return val;
    },
        z.array(
            z.string().regex(/^[0-9a-fA-F]{24}$/, {
                message: "Invalid ObjectId format",
            })
        )).optional(),

    status: z.enum(Object.values(Status) as [string]).optional(),

    role: z.enum(Object.values(Role) as [string]).optional(),
});