import AppError from "../../errorHerlpers/AppError";
import { IUser } from "../User/user.interface";
import { User } from "../User/user.model";
import http_status_code from 'http-status-codes'
import bcrypt from 'bcrypt'
import { createUserTokens } from "../../utils/createUserTokens";

// login service
const loginUser = async (payload: Partial<IUser>) => {

    const { email, password } = payload
    console.log(payload)

    const isUserExits = await User.findOne({ email: email as string })
    if (!isUserExits) {
        throw new AppError(http_status_code.NOT_FOUND, "user not found")
    }

    const matchPassword = bcrypt.compare(password as string, isUserExits.password as string)
    if (!matchPassword) {
        throw new AppError(http_status_code.BAD_REQUEST, "Password doesn't match!")
    }

    const userTokens = createUserTokens(isUserExits)

    const { password : pass, ...rest } = isUserExits.toObject()


    return {
        accessToken: (await userTokens).accessToken,
        refreshToken: (await userTokens).refreshToken,
        user: rest

    }

}


export const loginService = {
    loginUser
}