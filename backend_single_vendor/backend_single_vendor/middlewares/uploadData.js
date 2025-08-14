require('dotenv').config();
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');

// Configure AWS S3 with SDK v3
const s3Client = new S3Client({
    region: process.env.REGION_NAME,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

//  Multer Configuration for S3
const multerSetup = (allowedFileTypes, maxFileSize) => {
    const bucketName = process.env.BUCKET_NAME;

    // Configure storage to use S3 with multer-s3
    const storage = multerS3({
        s3: s3Client,
        bucket: bucketName, 
        acl: 'public-read', 
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            //  unique filename 
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, `uploads/${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
        }
    });

    // Configure file filtering
    const fileFilter = (req, file, cb) => {
        if (allowedFileTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type!'), false);
        }
    };

    // Return the multer instance
    return multer({
        storage: storage,
        limits: { fileSize: maxFileSize }, 
        fileFilter: fileFilter
    });
};

module.exports = multerSetup;








// const multer = require('multer');
// const path = require('path');

// // Dynamic Multer Configuration
// const multerSetup = (destinationPath, allowedFileTypes, maxFileSize) => {
//     // Configure storage
//     const storage = multer.diskStorage({
//         destination: (req, file, cb) => {
//             cb(null, destinationPath); // Set destination path
//         },
//         filename: (req, file, cb) => {
//             // Generate a unique filename
//             const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//             cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
//         }
//     });

//     // Configure file filtering
//     const fileFilter = (req, file, cb) => {
//         if (allowedFileTypes.includes(file.mimetype)) {
//             cb(null, true);
//         } else {
//             cb(new Error('Invalid file type!'), false);
//         }
//     };

//     // Return the multer instance
//     return multer({
//         storage: storage,
//         limits: { fileSize: maxFileSize }, // Set maximum file size
//         fileFilter: fileFilter
//     });
// };

// module.exports = multerSetup;
// require('dotenv').config();
// const multer = require('multer');
// const multerS3 = require('multer-s3');
// const AWS = require('aws-sdk');
// const path = require('path');

// // Configure AWS S3
// const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY, 
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, 
//     region: process.env.REGION_NAME, 
// });

// // Dynamic Multer Configuration for S3
// const multerSetup = ( allowedFileTypes, maxFileSize) => {
//     const bucketName=process.env.BUCKET_NAME;
//     // Configure storage to use S3 with multer-s3
//     const storage = multerS3({
//         s3: s3,
//         bucket: bucketName, // S3 Bucket name
//         acl: 'public-read', // Set the ACL (optional, use 'private' for private uploads)
//         metadata: (req, file, cb) => {
//             cb(null, { fieldName: file.fieldname });
//         },
//         key: (req, file, cb) => {
//             // Generate a unique filename using timestamp and random number
//             const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//             cb(null, `uploads/${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
//         }
//     });

//     // Configure file filtering
//     const fileFilter = (req, file, cb) => {
//         if (allowedFileTypes.includes(file.mimetype)) {
//             cb(null, true);
//         } else {
//             cb(new Error('Invalid file type!'), false);
//         }
//     };

//     // Return the multer instance
//     return multer({
//         storage: storage,
//         limits: { fileSize: maxFileSize }, // Set maximum file size
//         fileFilter: fileFilter
//     });
// };

// module.exports = multerSetup;

