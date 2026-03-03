import z from "zod";




export const EventLineUpZod = z.object({

    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(30, { message: "Name cannot exceed 30 characters." })
    ,
    designation: z.string().min(4, { message: "Designation must be at least 4 character long" })
})


export const updateLineupZod = z.object({

    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(30, { message: "Name cannot exceed 30 characters." }).optional()
    ,
    designation: z.string().min(4, { message: "Designation must be at least 4 character long" }).optional(),

    isDelete: z.boolean().optional()

})