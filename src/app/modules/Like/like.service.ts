import { Types } from "mongoose"
import { likeInterface } from "./like.interface"
import { Like } from "./like.model"
import { Post } from "../Post/post.model";




const likeCreateOrDelete = async (payload: Partial<likeInterface>) => {

    const { userId, postId } = payload;

    if (!userId || !postId) {
        throw new Error("UserId and PostId are required");
    }

    const existingLike = await Like.findOne({
        userId: userId as Types.ObjectId,
        postId: postId as Types.ObjectId
    });

    // If already liked → remove like
    if (existingLike) {
        await Like.deleteOne({
            userId: userId as Types.ObjectId,
            postId: postId as Types.ObjectId
        });

        await Post.findOneAndUpdate(
            { _id: postId },
            { $inc: { like: -1 } },
            { new: true }
        );

        return {
            liked: false,
            message: "Like removed successfully"
        };
    }

    // If not liked → create like
    const like = await Like.create(payload);
    await Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { like: 1 } },
        { returnDocument: "after", runValidators: true }
    );


    return {
        liked: true,
        message: "Post liked successfully",
        data: like
    };
};



export const likeService = {
    likeCreateOrDelete
}