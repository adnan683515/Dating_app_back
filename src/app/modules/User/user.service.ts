import  httpStatus  from 'http-status-codes';
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import AppError from '../../errorHerlpers/AppError';
import bcrypt from 'bcrypt'
import { envVars } from '../../config/env';



// create user service
const usercreate = async (payload: Partial<IUser>) => {

    const { email, password , ...rest } = payload

    const isUserExits = await User.findOne({email : email as string})

    if(isUserExits){
        throw new AppError(httpStatus.BAD_REQUEST, "user Already Exits")
    }

    const hashpassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))


    const authsProvider : IAuthProvider = {
        provider : "credentials", 
        providerId : email as string
    }



    const user = await User.create({
        email : email as string, 
        auths : [authsProvider], 
        password : hashpassword,  
        ...rest
    })


    return user

}

export const userService = {
    usercreate
}