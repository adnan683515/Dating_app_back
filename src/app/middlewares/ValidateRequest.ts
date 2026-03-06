import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";





export const validateRequest = (zodSchema: ZodTypeAny) => async (req: Request, res: Response, next: NextFunction) => {

    try {
        if (req.body.eventlineup) {
            req.body.eventlineup = JSON.parse(req.body.eventlineup)
        }
        req.body = await zodSchema.parseAsync(req?.body)
        next()
    }
    catch (error) {
        next(error)
    }
}