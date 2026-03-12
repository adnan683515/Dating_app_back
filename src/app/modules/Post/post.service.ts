import httpStatus from 'http-status-codes';
import AppError from "../../errorHerlpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { postInterface } from "./post.interface";
import { Post } from "./post.model";
import { Types } from 'mongoose';
import { object } from 'zod';
import { JwtPayload } from 'jsonwebtoken';
import { Like } from '../Like/like.model';









const postCreate = async (payload: Partial<postInterface>) => {


    const data = await Post.create(payload)

    return data
}


// const getPosts = async (query: Record<string, string>) => {

//     const queryBuilder = new QueryBuilder(Post.find(), query)

//     const postdata = queryBuilder.filter().search(['caption', 'description']).sort().fields().paginate().populate([{ path: "userId", select: 'image displayName' }])



//     const [data, meta] = await Promise.all([
//         postdata.build(),
//         queryBuilder.getMeta()
//     ])

//     return {
//         data,
//         meta
//     }
// }
const getPosts = async (query: Record<string, string>, currentUserId: string) => {
    const queryBuilder = new QueryBuilder(Post.find(), query);

    const postData = queryBuilder
        .filter()
        .search(['caption', 'description'])
        .sort()
        .fields()
        .paginate()
        .populate([{ path: "userId", select: 'image displayName' }]);

    const [data, meta] = await Promise.all([
        postData.build(),
        queryBuilder.getMeta()
    ]);

    // post IDs
    const postIds = data.map(post => post._id);

    // likes of current user
    const liked = await Like.find({
        postId: { $in: postIds },
        userId: currentUserId
    }).lean();

    // convert to string for safe comparison
    const likedSet = new Set(liked.map(l => l.postId.toString()));

    // attach likedByMe flag
    const postsWithLikedFlag = data.map(post => ({
        ...post.toObject(),
        likedByMe: likedSet.has(post._id.toString()), // <-- MUST convert to string

    }));

    return {
        data: postsWithLikedFlag,
        meta
    };
};





const getMyPost = async (user: JwtPayload, query: Record<string, string>) => {

    const querybuilder = new QueryBuilder(Post.find({ userId: user?.id }), query)

    const postdata = querybuilder.filter().sort().fields().paginate().populate([{ path: "userId", select: 'image displayName' }])
    const [data, meta] = await Promise.all([
        postdata.build(),
        querybuilder.getMeta()
    ])

    return {
        data,
        meta
    }
}


const updatePost = async (postId: string, payload: Partial<postInterface>, userId: string) => {


    const isExitsPost = await Post.findById(postId)

    if (!isExitsPost) {
        throw new AppError(httpStatus.NOT_FOUND, "This post not found!")
    }

    if (payload?.userId) {
        throw new AppError(httpStatus.BAD_REQUEST, "userId can not update")
    }

    const userIdPost = isExitsPost?.userId as Types.ObjectId

    if (userIdPost.toString() !== userId) {
        throw new AppError(403, "You are not allowed to delete this post");
    }


    const update = await Post.findOneAndUpdate(
        { _id: postId },
        { $set: payload },
        { returnDocument: "after", runValidators: true }
    )


    return update

}





export const postService = {
    postCreate,
    getPosts,
    updatePost,
    getMyPost
}