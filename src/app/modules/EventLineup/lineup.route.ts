import { Router } from "express";
import { lineupController } from "./lineup.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import { validateRequest } from "../../middlewares/ValidateRequest";
import { EventLineUpZod, updateLineupZod } from "./lineupValidation";




const route = Router()

route.post('/lineup-create', validateRequest(EventLineUpZod), checkAuth(Role.ADMIN), lineupController.lineupcreated)

route.get('/lineup-data', checkAuth(...Object.values(Role)), lineupController.getLineup)


route.patch('/update-line/:id', checkAuth(Role.ADMIN), validateRequest(updateLineupZod), lineupController.updateLineUp)


export const LineupRoute = route