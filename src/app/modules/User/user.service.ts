import httpStatus from 'http-status-codes';
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import AppError from '../../errorHerlpers/AppError';
import bcrypt from 'bcrypt'
import { envVars } from '../../config/env';

import { sendEmail } from '../../utils/sendOTP';
import { Types } from 'mongoose';
import { object } from 'zod';




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
const getAllUsers = async () => {

    const users = await User.find({
        email: {
            $ne: envVars.ADMIN_EMAIL
        }
    })

    return users
}



// get me 
const getMe = async (userId: string) => {
    const user = await User.findById(userId).select('-password')
    return user

}

// get singleUser

const singleUser = async (userId : string)=>{


    const user = await User.findById(userId).select('-password')
    if(!user){
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