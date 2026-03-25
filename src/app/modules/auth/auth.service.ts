import AppError from "../../errorHerlpers/AppError";
import { IOTP, IUser } from "../User/user.interface";
import { OTP, User } from "../User/user.model";
import http_status_code from 'http-status-codes'
import bcrypt from 'bcrypt'
import { createUserTokens } from "../../utils/createUserTokens";
import { IChangePassword } from "./auth.interface";
import { envVars } from "../../config/env";
import { sendEmail } from "../../utils/sendOTP";
import { generateTokenFn } from "../../utils/jwt";


// login service
const loginUser = async (payload: Partial<IUser>) => {

    const { email, password } = payload


    const isUserExits = await User.findOne({ email: email as string })


    if (!isUserExits) {
        throw new AppError(http_status_code.NOT_FOUND, "user not found")
    }

    // if (!isUserExits.isVerified) {
    //     throw new AppError(http_status_code.BAD_REQUEST, "user not verified")
    // }




    const matchPassword = await bcrypt.compare(password as string, isUserExits.password as string)
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

        throw new AppError(http_status_code.BAD_REQUEST, "OTP expired")
    }

    if (user?.otp !== otp) {
        throw new AppError(http_status_code.BAD_REQUEST, "Invalid OTP. Please try again")
    }

    // delete from otp model this email
    await OTP.deleteOne({ email: email as string })

    // verified true kore deya holo from user model
    await User.updateOne({ email: email as string }, { $set: { isVerified: true } })


    return true


}




// change password when user is login
const changePasswordService = async (payload: IChangePassword) => {

    const { currentPassword, newPassword, confirmPassword, email } = payload

    if (newPassword !== confirmPassword) {
        throw new AppError(http_status_code.BAD_REQUEST, "password doesn't match!")
    }

    const user = await User.findOne({ email: email as string })
    if (!user) {
        throw new AppError(http_status_code.NOT_FOUND, "user not found!")
    }

    const isMatchPass = await bcrypt.compare(currentPassword, user?.password as string)
    if (!isMatchPass) {
        throw new AppError(http_status_code.BAD_REQUEST, "password deosn't match!")
    }

    const hassPass = await bcrypt.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))


    user.password = hassPass
    await user.save()

    return true


}


// forget password send otp when is forgot his password ..give me email send otp and token send 
const sendOtpUseingEmail = async (email: string) => {


    const user = await User.findOne({ email })

    if (!user) {
        throw new AppError(http_status_code.NOT_FOUND, "This user not found!")
    }

    const otp = await sendEmail(email)



    const userPayLoad = {
        email: user.email,
        id: user._id,
        role: user.role,
        otp
    }

    const accessToken = await generateTokenFn(userPayLoad, envVars.JWT_ACCESS_SECRET, "1m")



    return accessToken


}







export const loginService = {
    loginUser,
    verifyuser,
    changePasswordService,
    sendOtpUseingEmail
}