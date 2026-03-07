import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import { commentController } from "./comment.controller";




const route = Router()

route.post('/create-comment', checkAuth(...Object.values(Role)), commentController.createComment)



route.get('/get-comments/:id', checkAuth(...Object.values(Role)) , commentController.getComments)

route.patch('/update-comment/:id', checkAuth(...Object.values(Role)) , commentController.updateComment )


export const CommentRoute = route