import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import { postController } from "./post.controller";
import { multerUpload } from "../../config/multer.config";




const route = Router()

// create post
route.post('/create-post', multerUpload.single('file'), checkAuth(...Object.values(Role)), postController.createPost)


// get my post and all post
route.get('/get-post', checkAuth(...Object.values(Role)), postController.getpost)


// update post
route.patch('/update-post/:id', multerUpload.single('file'), checkAuth(...Object.values(Role)), postController.updatepost)

export const PostRoute = route