import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinaryUpload,
//     params: {
//         public_id: (req, file) => {

//             const fileName = file.originalname
//                 .toLowerCase()
//                 .replace(/\s+/g, "-") // space → dash
//                 .replace(/\./g, "-")  // remove dot
//                 .replace(/[^a-z0-9\-]/g, ""); // remove special chars

//             const extension = file.originalname.split(".").pop();

//             const uniqueFileName =
//                 Math.random().toString(36).substring(2) +
//                 "-" +
//                 Date.now() +
//                 "-" +
//                 fileName +
//                 "." +
//                 extension;

//             return uniqueFileName;
//         }
//     }
// });





const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: (req, file) => {
    const fileName = file.originalname
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/\./g, "-")
      .replace(/[^a-z0-9\-]/g, "");
    const extension = file.originalname.split(".").pop();

    return {
      resource_type: "auto",  // image/video উভয় support করবে
      public_id: `${Math.random().toString(36).substring(2)}-${Date.now()}-${fileName}.${extension}`,
    };
  },
});

export const multerUpload = multer({
    storage: storage,

  
    limits: {
        fileSize: 20 * 1024 * 1024
    }
    ,
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/png",
            "image/jpeg",
            "image/jpg",
            "video/mp4",
            "video/mov",
            "video/avi"
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only PNG, JPG, JPEG images are allowed"));
        }

    }
});