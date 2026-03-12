import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";

import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import AppError from "../errorHerlpers/AppError";
import { envVars } from "./env";
import Stream from "stream";


// cloudinary.config({
//   cloud_name: envVars?.CLOUD_NAME,
//   api_key: envVars?.CLOUD_API_KEY,
//   api_secret: envVars?.CLOUD_API_SECRET,
// });

// export const uploadBufferToCloudinary = async (
//   buffer: Buffer,
//   fileName: string
// ): Promise<UploadApiResponse | undefined> => {
//   try {
//     return new Promise((resolve, reject) => {
//       const public_id = `${fileName}-${Date.now()}`;

//       const bufferStream = new Stream.PassThrough();
//       bufferStream.end(buffer);

//       cloudinary.uploader
//         .upload_stream(
//           {
//             resource_type: 'auto',
//             public_id: public_id,
//             folder: 'images',
//           },
//           (error, result) => {
//             if (error) {
//               return reject(error);
//             }
//             resolve(result);
//           }
//         )
//         .end(buffer);
//     });
//   } catch (error: any) {
//     console.log(error);
//     throw new AppError(401, `Error uploading file ${error.message}`);
//   }
// };


// export const deleteImageFromCLoudinary = async (url: string) => {
//   try {
//     if (!url) {
//       return;
//     }
//     const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp|avif)$/i;
//     const match = url.match(regex);

//     if (match && match[1]) {
//       const public_id = match[1];
//       await cloudinary.uploader.destroy(public_id);
//     }
//   } catch (error: any) {
//     throw new AppError(401, 'Cloudinary image deletion failed', error.message);
//   }
// };





// const storage = new CloudinaryStorage({
//   cloudinary: cloudinaryUpload,
//   params: (req, file) => {
//     const fileName = file.originalname
//       .toLowerCase()
//       .replace(/\s+/g, "-")
//       .replace(/\./g, "-")
//       .replace(/[^a-z0-9\-]/g, "");
//     const extension = file.originalname.split(".").pop();

//     return {
//       resource_type: "auto",  // image/video উভয় support করবে
//       public_id: `${Math.random().toString(36).substring(2)}-${Date.now()}-${fileName}.${extension}`,
//     };
//   },
// });

// user_post_upload
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
      resource_type: "auto",
      folder: "posts",
      upload_preset: "user_post_upload",
      public_id: `${Math.random().toString(36).substring(2)}-${Date.now()}-${fileName}.${extension}`,
    };
  },
});


export const multerUpload = multer({
  storage: storage,


  limits: {
    fileSize: 100 * 1024 * 1024
  }
  ,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "video/mp4",
      "video/mov",
      "video/avi",
      "image/heic"
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PNG, JPG, JPEG images are allowed"));
    }

  }
});






export const deleteImageFromCloudinary = async (url: string) => {
  try {
    if (!url) return;

    const urlObj = new URL(url);
    const pathname = urlObj.pathname; // /demo/image/upload/v1680000000/myimage.jpg
    const parts = pathname.split("/upload/");

    if (parts.length < 2) {
      throw new AppError(400, "Invalid Cloudinary URL");
    }

    const publicIdWithVersion = parts[1];

    if (!publicIdWithVersion) {
      throw new AppError(400, "Unable to extract publicId from URL");
    }

    // Safely extract publicId
    const publicId = publicIdWithVersion
      .replace(/v\d+\//, "")
      .replace(/\.(jpg|jpeg|png|gif|webp|avif)$/i, "");

    await cloudinary.uploader.destroy(publicId);
  } catch (error: any) {
    throw new AppError(401, "Cloudinary image deletion failed", error.message);
  }
};