import { Request, Response, RequestHandler } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import asyncHandler from '../../middleware/asyncHandler';
import { ExtendedError } from '../../middleware/errorMiddleware';
import fileFilter from './fileFilter';
import { MAX_IMAGE_FILE_SIZE } from '../../constantsBackend';

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_IMAGE_FILE_SIZE },
  fileFilter,
});

const uploadMiddleware = upload.single('imageURL');

const runMiddleware = (fn: RequestHandler, req: Request, res: Response) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

const uploadDefault = async (dataURI: string) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return cloudinary.uploader.upload(dataURI, {
    resource_type: 'auto',
  });
};

const uploadImageToCloudinary = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file || !req.file.buffer || !req.file.mimetype) {
      throw new ExtendedError('File is missing from request');
    }
    try {
      await runMiddleware(uploadMiddleware, req, res);
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
      const cldRes = await uploadDefault(dataURI);
      return cldRes.secure_url;
    } catch (err: any) {
      throw new ExtendedError(err.message || err, 500);
    }
  }
);

export { uploadImageToCloudinary };
