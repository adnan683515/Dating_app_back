import AppError from "../../errorHerlpers/AppError";
import { IOTP, IUser } from "../User/user.interface";
import { OTP, User } from "../User/user.model";
import http_status_code from 'http-status-codes'
import bcrypt from 'bcrypt'
import { createUserTokens } from "../../utils/createUserTokens";

// login service
const loginUser = async (payload: Partial<IUser>) => {

    const { email, password } = payload


    const isUserExits = await User.findOne({ email: email as string })


    if (!isUserExits) {
        throw new AppError(http_status_code.NOT_FOUND, "user not found")
    }

    if (!isUserExits.isVerified) {
        throw new AppError(http_status_code.BAD_REQUEST, "user not verified")
    }




    const matchPassword = bcrypt.compare(password as string, isUserExits.password as string)
    if (!matchPassword) {
        throw new AppError(http_status_code.BAD_REQUEST, "Password doesn't match!")
    }

    const userTokens = await createUserTokens(isUserExits)



    const { password: pass, ...rest } = isUserExits.toObject()


    return {
        accessToken: (userTokens).accessToken,
        refreshToken: (userTokens).refreshToken,
        user: rest
    }

}


// verify user

const verifyuser = async (payload: Partial<IOTP>) => {

    const { email, otp } = payload

    const user = await OTP.findOne({ email: email as string })

    if (user?.expiresAt && new Date(user.expiresAt) < new Date()) {
        console.log("OTP expired");
        throw new AppError(http_status_code.BAD_REQUEST, "OTP expired")
    }

    if (user?.otp !== otp) {
        throw new AppError(http_status_code.BAD_REQUEST, "OTP did not match")
    }

    // delete from otp model this email
    await OTP.deleteOne({email : email as string})

    // verified true kore deya holo from user model
    await User.updateOne({email : email as string}, {$set : {isVerified : true}})


    return true


}

export const loginService = {
    loginUser,
    verifyuser
}