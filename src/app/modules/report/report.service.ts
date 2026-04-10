import httpStatus from 'http-status-codes';
import AppError from "../../errorHerlpers/AppError";
import { Block } from "../Block/block.model";
import { Post } from "../Post/post.model";
import { User } from "../User/user.model";
import { IReport, reportType } from "./report.interface";
import Report from "./report.model";
import { QueryBuilder } from '../../utils/QueryBuilder';



const createReport = async (payload: Partial<IReport>) => {

    const { reporter, type } = payload

    const ckReporter = await User.findById(reporter)
    if (!ckReporter) {
        throw new AppError(httpStatus.NOT_FOUND, "Repoter Id not found")
    }

    if (type == reportType.POST) {
        const id = payload.postId
        const ckPost = await Post.findById(id)
        if (!ckPost) {
            throw new AppError(httpStatus.NOT_FOUND, "Report post not found!")
        }


        const ckAlreadyReport = await Report.findOne({ reporter: payload.reporter, postId: id })
        if (ckAlreadyReport) {
            throw new AppError(httpStatus.BAD_REQUEST, "You have already reported this post")
        }

    }
    else if (type === reportType.USER) {
        const uId = payload.userId
        const ckUser = await User.findById(uId)
        if (!ckUser) {
            throw new AppError(httpStatus.NOT_FOUND, "Report user not found!")
        }
        const ckAlreadyReport = await Report.findOne({ reporter: payload.reporter, userId: uId })
        if (ckAlreadyReport) {
            throw new AppError(httpStatus.BAD_REQUEST, "You have already reported this user")
        }
    }



    if (type == reportType.POST_AND_USER_BLOCK) {

        if (!payload.postId || !payload.userId) {
            throw new AppError(httpStatus.BAD_REQUEST, "please give me both id (post and user)")
        }


        // ck user 
        const uId = payload.userId
        const ckUser = await User.findById(uId)
        if (!ckUser) {
            throw new AppError(httpStatus.NOT_FOUND, "Report user not found!")
        }



        // ck post
        const id = payload.postId
        const ckPost = await Post.findOne({ _id: id, userId: payload.userId })
        if (!ckPost) {
            throw new AppError(httpStatus.NOT_FOUND, "Report post not found!")
        }


        //current user ki  post report and user block ck
        const ckAlreadyReportPostandBlock = await Report.findOne({ reporter: payload.reporter, postId: id, userId: uId })
        if (ckAlreadyReportPostandBlock) {
            throw new AppError(httpStatus.BAD_REQUEST, "You have already reported this post and block")
        }


        const ckReportPost = await Report.findOne({ type: reportType.POST, postId: id, reporter: payload.reporter })

        if (ckReportPost) {
            throw new AppError(httpStatus.BAD_REQUEST, "Already this post is repoted!")
        }


        const ckBlock = await Block.findOne({ blockedUserId: uId, blockerUserId: payload.reporter })
        if (ckBlock) {
            throw new AppError(httpStatus.BAD_REQUEST, "Already This user is blocked")
        }



        const blockuser = await Block.create({ blockedUserId: uId, blockerUserId: payload.reporter })
        const reportPost = await Report.create({ type: reportType.POST, postId: id, reporter: payload.reporter, text: payload.text })


        return {
            reportPost,
            blockuser
        }

    }
    const data = await Report.create(payload)
    return data
}



const getAllPostreport = async (query: Record<string, string>) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = query.search || "";

    const matchStage: any = {
        postId: { $ne: null }
    };

    const data = await Report.aggregate([
        // filter reports
        {
            $match: matchStage
        },

        // group by post
        {
            $group: {
                _id: "$postId",
                totalReports: { $sum: 1 },
                latestReport: { $first: "$$ROOT" }
            }
        },

        // join posts
        {
            $lookup: {
                from: "posts",
                localField: "_id",
                foreignField: "_id",
                as: "post"
            }
        },

        {
            $unwind: "$post"
        },

        // caption search filter 
        {
            $match: search
                ? {
                    "post.caption": {
                        $regex: search,
                        $options: "i"   // case insensitive
                    }
                }
                : {}
        },

        // shape response
        {
            $project: {
                _id: 0,
                totalReports: 1,
                post: {
                    _id: "$post._id",
                    caption: "$post.caption",
                    imageOrVideo: "$post.imageOrVideo",
                    userId: "$post.userId",
                    isDelete: "$post.isDelete"
                }
            }
        },
        //  sort
        {
            $sort: { totalReports: -1 }
        },

        //  pagination
        {
            $skip: skip
        },
        {
            $limit: limit
        }
    ]);


    const totalResult = await Report.aggregate([
        {
            $match: matchStage
        },
        {
            $group: {
                _id: "$postId"
            }
        },
        {
            $lookup: {
                from: "posts",
                localField: "_id",
                foreignField: "_id",
                as: "post"
            }
        },
        {
            $unwind: "$post"
        },

        // same search apply here
        {
            $match: search
                ? {
                    "post.caption": {
                        $regex: search,
                        $options: "i"
                    }
                }
                : {}
        },

        {
            $count: "total"
        }
    ]);

    const total = totalResult[0]?.total || 0;

    return {
        data,
        meta: {
            page,
            limit,
            total,
            totalpage: Math.ceil(total / limit)
        }
    };
};


const getAllUserreport = async (query: Record<string, string>) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const matchStage = {
        userId: { $ne: null }
    };

    // =========================
    // 📊 MAIN DATA PIPELINE
    // =========================
    const data = await Report.aggregate([
        // 1️⃣ match filter
        {
            $match: matchStage
        },

        // 2️⃣ group by reported user
        {
            $group: {
                _id: "$userId",
                totalReports: { $sum: 1 },
                latestReport: { $first: "$$ROOT" }
            }
        },

        // 3️⃣ join user collection
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "user"
            }
        },

        // 4️⃣ convert array → object
        {
            $unwind: "$user"
        },

        // 5️⃣ final shape
        {
            $project: {
                _id: 0,
                totalReports: 1,
                user: {
                    _id: "$user._id",
                    displayName: "$user.displayName",
                    image: "$user.image",
                    email: "$user.email"
                }
            }
        },

        // 6️⃣ sort by most reported
        {
            $sort: { totalReports: -1 }
        },

        // 🔥 7️⃣ PAGINATION (IMPORTANT FIX)
        {
            $skip: skip
        },
        {
            $limit: limit
        }
    ]);

    // =========================
    // 📊 TOTAL COUNT META
    // =========================
    const totalResult = await Report.aggregate([
        {
            $match: matchStage
        },
        {
            $group: {
                _id: "$userId"
            }
        },
        {
            $count: "total"
        }
    ]);

    const total = totalResult[0]?.total || 0;

    return {
        data,
        meta: {
            page,
            limit,
            total,
            totalpage: Math.ceil(total / limit)
        }
    };
};



const countOfReport = async () => {

    const result = await Report.aggregate([
        {
            $facet: {

                // total reports
                totalReports: [
                    { $count: "count" }
                ],

                // user reports
                userReports: [
                    {
                        $match: {
                            userId: { $ne: null }
                        }
                    },
                    { $count: "count" }
                ],

                // post reports
                postReports: [
                    {
                        $match: {
                            postId: { $ne: null }
                        }
                    },
                    { $count: "count" }
                ],

                // extra → unique reported users
                uniqueReportedUsers: [
                    {
                        $match: {
                            userId: { $ne: null }
                        }
                    },
                    {
                        $group: {
                            _id: "$userId"
                        }
                    },
                    { $count: "count" }
                ]
            }
        }
    ]);

    const data = result[0];

    return {
        totalReports: data.totalReports[0]?.count || 0,
        userReports: data.userReports[0]?.count || 0,
        postReports: data.postReports[0]?.count || 0,
        uniqueReportedUsers: data.uniqueReportedUsers[0]?.count || 0
    };
};

export const reportService = {
    createReport,
    getAllPostreport,
    getAllUserreport,
    countOfReport
}