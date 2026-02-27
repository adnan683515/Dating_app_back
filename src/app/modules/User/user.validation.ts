import z from "zod";

export const createUserZodSchema = z.object({

    displayName: z.string().min(2, { message: "Name must be at least 2 characters long" }).max(20, { message: "Name must be at most 20 characters long" }),

    email: z.string().email({ message: "Please provide a valid email address" }),
    
    password: z.string().min(8, { message: "Password must be at least 8 character" }).optional(), 

})