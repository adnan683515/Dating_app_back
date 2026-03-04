


import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";


const storage = new CloudinaryStorage({
    cloudinary: cloudinaryUpload,
    params: {
        public_id: (req, file) => {

            const fileName = file.originalname
                .toLocaleLowerCase()
                .replace(/\$+/g, "-") // space bad diye dash bosbe
                .replace(/\./g, '-') // .dot bad dibe
                .replace(/[^a-z0-9\-\.]/g, '') //@,#,$ bad diye dibe


            const extension = file.originalname.split('.').pop()

            const uniqueFileName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileName + "." + extension

            return uniqueFileName

        }
    }
})


export const multerUpload = multer({
    storage: storage
})