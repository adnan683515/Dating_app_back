import bcrypt from 'bcrypt';
import httpStatus from 'http-status-codes';
import { Types } from 'mongoose';
import AppError from '../../errorHerlpers/AppError';
import { sendEmail } from '../../utils/sendOTP';
import { envVars } from './../../config/env';
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import { userFields } from './user.constants';




// create user service
const usercreate = async (payload: Partial<IUser>) => {

    const { email, password, ...rest } = payload

    const isUserExits = await User.findOne({ email: email as string })

    if (isUserExits) {
        throw new AppError(httpStatus.BAD_REQUEST, "user Already Exits")
    }

    const hashpassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))


    const authsProvider: IAuthProvider = {
        provider: "credentials",
        providerId: email as string
    }



    await sendEmail(email as string)


    const user = await User.create({
        email: email as string,
        auths: [authsProvider],
        password: hashpassword,
        ...rest
    })


    return user

}

// update user
const updateUser = async (userId: string, payload: Partial<IUser>): Promise<IUser | null> => {

    // Spread payload
    const { ...updatedFields } = payload;

    // Convert to ObjectId
    const idd = new Types.ObjectId(userId);

    // Find user first
    const findUser = await User.findOne({ _id: idd });
    if (!findUser) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    // Update user dynamically
    const updatedUser = await User.findOneAndUpdate(
        { _id: idd },
        { $set: updatedFields },
        { returnDocument: "after", runValidators: true } // return updated doc,

        // returnDocument after mane udpate hoyar por data daw
        // runValidators dile schema ta kaj korbe
    );

    return updatedUser;
};


// get all users with out admin
const getAllUsers = async (query: Record<string, string>) => {



    const filter = query
    const searchTerm = filter?.searchTerm || ""
    const sort = query?.sort || "-createdAt"


    // delete filter["searchTerm"]
    // delete filter['sort']


    const excludeField = ["searchTerm", "sort"]
    for (const field of excludeField) {
        delete filter[field]
    }

    const searchArray = {
        $or: userFields?.map((item) => ({ [item]: { $regex: searchTerm, $options: 'i' } }))
    }
    // {
    //     $or : [
    //         {title : {$regex : value , $options : "i"}},
    //         {bio : {$regex : value , $options : "i"}},
    //         {role : {$regex : value , $options : "i"}},
    //     ]
    // }


    const users = await User.find({
        $and: [
            searchArray,
            { email: { $ne: envVars.ADMIN_EMAIL } }
        ]
    }).find(filter).sort(sort).populate('interests')


    const totaluser = await User.find({ email: { $ne: envVars.ADMIN_EMAIL } }).countDocuments()
    return {
        data: users,
        meta: {
            total: totaluser
        }
    }
}



// get me 
const getMe = async (userId: string) => {
    const user = await User.findById(userId).select('-password')
    return user

}



// get singleUser
const singleUser = async (userId: string) => {


    const user = await User.findById(userId).select('-password')
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found!")
    }
    return user
}

export const userService = {
    usercreate,
    updateUser,
    getAllUsers,
    getMe,
    singleUser
}