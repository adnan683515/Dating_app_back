import { postInterface } from "./post.interface";
import { Post } from "./post.model";









const postCreate = async (payload: Partial<postInterface>) => {


    const data = await Post.create(payload)

    return data
}



export const postController = {
    postCreate
}