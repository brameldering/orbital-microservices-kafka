import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import fileFilter from './imageFileFilter.js';
import { MAX_IMAGE_FILE_SIZE } from '../../constantsBackend.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const cloudinaryStorage = multer.memoryStorage();
const cloudinarySettings = multer({
  storage: cloudinaryStorage,
  limits: { fileSize: MAX_IMAGE_FILE_SIZE },
  fileFilter,
}).single('image');

export { cloudinary, cloudinarySettings };
