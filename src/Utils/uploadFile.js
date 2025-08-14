import S3FileUpload from 'react-s3/lib/ReactS3.js';
import { credAndUrl } from '../config/config.js';

const config = {
     bucketName: credAndUrl?.BUCKET_NAME,
     dirName: credAndUrl?.DIR_NAME,
     region: credAndUrl?.REGION,
     accessKeyId: credAndUrl?.ACCESS_KEY_ID,
     secretAccessKey: credAndUrl?.SECRET_ACCESS_KEY,
 };

 console.log(credAndUrl,"credAndUrl")

 window.Buffer = window.Buffer || require("buffer").Buffer;

  export const onImageHandler = async (e) => {
    const file = e.target.files[0];
    console.log("filetype in img", file?.type, file);
    if
        (
            file?.type === "image/jpeg" ||
            file?.type === "image/jpg" ||
            file?.type === "image/png"
    ) {
        if (file.size * 0.000001 <= 5) {
            const data = await S3FileUpload.uploadFile(file, config)
            console.log(data,"internal")
           return [file,data];
        }
        else {
            return "Image should be below 5MB";
        }
    } else {
       return "*Please upload in JPEG,PNG,JPG format Only";

    }
}