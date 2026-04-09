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

        // ck post
        const id = payload.postId
        const ckPost = await Post.findById(id)
        if (!ckPost) {
            throw new AppError(httpStatus.NOT_FOUND, "Report post not found!")
        }

        // ck user 
        const uId = payload.userId
        const ckUser = await User.findById(uId)
        if (!ckUser) {
            throw new AppError(httpStatus.NOT_FOUND, "Report user not found!")
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


    const querybuilder = new QueryBuilder(Report.find({
        postId: { $ne: null }
    }), query)

    const postdata = querybuilder.filter().sort().fields().paginate().populate([{ path: "reporter", select: 'image displayName' }, { path: 'postId', select: 'caption imageOrVideo' }])
    const [data, meta] = await Promise.all([
        postdata.build(),
        querybuilder.getMeta()
    ])

    return {
        data,
        meta
    }
}





// const getAllUserreport = async (query: Record<string, string>) => {


//     const querybuilder = new QueryBuilder(Report.find({ userId: { $ne: null } }), query)

//     const postdata = querybuilder.filter().sort().fields().paginate().populate([{ path: "reporter", select: 'image displayName' }, { path: 'postId', select: 'caption imageOrVideo' }])
//     const [data, meta] = await Promise.all([
//         postdata.build(),
//         querybuilder.getMeta()
//     ])

//     return {
//         data,
//         meta
//     }
// }






export const reportService = {
    createReport,
    getAllPostreport
}