import  httpStatus  from 'http-status-codes';
import { IUser } from "./user.interface";
import { User } from "./user.model";
import AppError from '../../errorHerlpers/AppError';



const usercreate = async (payload: Partial<IUser>) => {

    const { email, password , ...rest } = payload

    const isUserExits = await User.findOne({email : email as string})

    if(!isUserExits){
        throw new AppError(httpStatus.BAD_REQUEST, "user Already Exits")
    }






}

export const userService = {
    usercreate
}