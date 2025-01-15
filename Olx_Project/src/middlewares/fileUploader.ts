import multer from 'multer';
import path from 'path';
import "dotenv/config";

const storageConfig = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/uploads/');
    },
    filename: (req, file, callback) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        callback(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

export const fileUploader = multer({
    storage: storageConfig,
    limits: { files: parseInt(process.env.MAX_IMAGES || '5', 10) },
    fileFilter: (req, file, callback) => {
        const allowedFileTypes = /jpeg|jpg|png/;
        const isValidExt = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
        const isValidMime = allowedFileTypes.test(file.mimetype);

        if (isValidExt && isValidMime) {
            callback(null, true);
        } else {
            callback(new Error('Only image files (jpeg, jpg, png) are allowed'));
        }
    }
});
