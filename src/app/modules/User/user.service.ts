import { IUser } from "./user.interface";



const usercreate = async (payload: Partial<IUser>) => {

    const { email, password ,displayName } = payload
    console.log(email)
    if (!email) {
        console.log("email not found")
    }

    if (!password) {
        console.log("password not found")
    }

    if(!displayName){
        console.log("Name not found")
    }
}

export const userService = {
    usercreate
}