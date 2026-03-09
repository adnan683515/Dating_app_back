import { Types } from "mongoose";
import AppError from "../../errorHerlpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Post } from "../Post/post.model";

import httpStatus from 'http-status-codes'
import { Icomment } from "./comments.interface";
import { Comment } from "./comment.model";


// Helper function: nested comment
const buildNestedComments = (comments: any[]) => {
    const map = new Map();

    // প্রথমে সব কমেন্টকে map-এ রাখি
    comments.forEach(comment => map.set(comment._id.toString(), { ...comment.toObject(), replies: [] }));

    const nested: any[] = [];

    comments.forEach(comment => {
        if (comment.parentId) {
            const parent = map.get(comment.parentId.toString());
            if (parent) {
                parent.replies.push(map.get(comment._id.toString()));
            }
        } else {
            nested.push(map.get(comment._id.toString()));
        }
    });

    return nested;
}



// create-post
const createComment = async (payload: Partial<Icomment>) => {
    const { postId, userId, parentId } = payload;


    const isExitsPost = await Post.findById(postId);
    if (!isExitsPost) {
        throw new AppError(httpStatus.NOT_FOUND, "This post does not exist");
    }



    if (parentId) {


        const parentComment = await Comment.findOne({
            _id: parentId,
            postId: postId as Types.ObjectId
        });



        if (!parentComment) {
            throw new AppError(httpStatus.BAD_REQUEST, "Parent comment does not exist in this post");
        }
    }


    const commentData = await Comment.create(payload);
    return commentData;
}

// get-Comment
const getComments = async (id: string, query: Record<string, string>) => {

    const postId = id


    const queryBuilder = new QueryBuilder(Comment.find({ postId, isDelete: false }), query)

    const commentData = queryBuilder.filter().search(['comment']).sort().fields().paginate().populate([{
        path: 'userId'
    }])

    const [data, meta] = await Promise.all([
        commentData.build(),
        queryBuilder.getMeta()
    ])

    const nestedComments = buildNestedComments(data)


    return {
        data: nestedComments,
        meta
    }
}



// update comment status
const updateComments = async (id: string) => {

    const ckComment = await Comment.findById(id)
    if (!ckComment) {
        throw new AppError(httpStatus.NOT_FOUND, "Comment not found!")
    }

    const data = await Comment.findOneAndUpdate(
        { _id: id },
        { $set: { isDelete: true } },
        {
            returnDocument: "after", runValidators: true

        }
    )

    return data

}


export const commentService = {

    createComment,
    getComments,
    updateComments
}