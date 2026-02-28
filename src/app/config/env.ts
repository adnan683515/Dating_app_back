
import dotenv from 'dotenv';
dotenv.config()


interface EnvConfig {

    PORT  : string , 
    DB_URL : string, 

    NODE_ENV : "development" | "production", 

    JWT_ACCESS_EXPIRES : string, 
    JWT_ACCESS_SECRET : string, 


    JWT_REFRESH_EXPIRES : string, 
    JWT_REFRESH_SECRET : string,

    ADMIN_EMAIL : string, 
    ADMIN_PASSWORD : string, 
    
    BCRYPT_SALT_ROUND : string,

    APP_PASSWORD : string,

}


const loadEnvVariables = () : EnvConfig => {

    const requiredEnvVariables : string[] = ['PORT', 'BCRYPT_SALT_ROUND' , 'APP_PASSWORD',  'DB_URL', 'ADMIN_EMAIL', 'ADMIN_PASSWORD', 'JWT_REFRESH_EXPIRES', 'JWT_REFRESH_SECRET','JWT_ACCESS_EXPIRES', 'JWT_ACCESS_SECRET', 'DB_URL', 'PORT']


    requiredEnvVariables?.forEach(key =>{

        if(!process.env[key]){
            throw new Error(`Missing require enviroment variable  ${key}`)
        }
    })


    return {

        PORT : process.env.PORT as string, 
        DB_URL  : process.env.DB_URL  as string,

        ADMIN_EMAIL : process.env.ADMIN_EMAIL as string, 
        ADMIN_PASSWORD : process.env.ADMIN_PASSWORD as string,

        JWT_REFRESH_EXPIRES : process.env.JWT_REFRESH_EXPIRES as string, 
        JWT_REFRESH_SECRET : process.env.JWT_REFRESH_SECRET as string, 


        JWT_ACCESS_SECRET : process.env.JWT_ACCESS_SECRET as string,
        JWT_ACCESS_EXPIRES : process.env.JWT_ACCESS_EXPIRES as string,

        NODE_ENV : process.env.NODE_ENV as "development" | "production",

        APP_PASSWORD : process.env.APP_PASSWORD as string,

        BCRYPT_SALT_ROUND : process.env.BCRYPT_SALT_ROUND as string

    }
}




export const envVars = loadEnvVariables()