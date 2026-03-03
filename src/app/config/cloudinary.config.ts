

// amader folder -> image -> form-data -> file -> multer -> nijer akta folder(temporary) -> req.file


// req.file -> cloudinary(req.file) -> url -> mongoose -> mongodb set korbo



import { v2  as cloudinary} from "cloudinary";
import { envVars } from "./env";

cloudinary.config({
    cloud_name : envVars.CLOUD_NAME,
    api_key : envVars.CLOUD_API_KEY,
    api_secret : envVars.CLOUD_API_SECRET
})


const 