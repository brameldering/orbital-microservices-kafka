import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import asyncHandler from '../../general/middleware/asyncHandler.js';
import { ExtendedError } from '../../general/middleware/errorMiddleware.js';
import fileFilter from './fileFilter.js';
import { MAX_IMAGE_FILE_SIZE } from '../../constantsBackend.js';

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_IMAGE_FILE_SIZE },
  fileFilter,
});

const uploadMiddleware = upload.single('imageURL');

const runMiddleware = (fn, req, res) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

const uploadDefault = async (dataURI) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return cloudinary.uploader.upload(dataURI, {
    resource_type: 'auto',
  });
};

const uploadImageToCloudinary = asyncHandler(async (req, res) => {
  try {
    await runMiddleware(uploadMiddleware, req, res);
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
    const cldRes = await uploadDefault(dataURI);
    return cldRes.secure_url;
  } catch (err) {
    throw new ExtendedError(err.message || err, 500);
  }
});

export { uploadImageToCloudinary };
