import path from 'path';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import asyncHandler from '../../general/middleware/asyncHandler.js';
import {
  SERVER_DISK_UPLOADS_FOLDER,
  UPLOADS_URL,
  MAX_IMAGE_FILE_SIZE,
} from '../../constantsBackend.js';

// Private function to check for image file types
const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Images only!'), false);
  }
};

// ================ Upload to Server Disk ================
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, SERVER_DISK_UPLOADS_FOLDER);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const uploadDisk = multer({
  storage: diskStorage,
  limits: { fileSize: MAX_IMAGE_FILE_SIZE },
  fileFilter,
});
const uploadSingleImageDisk = uploadDisk.single('image');

// @desc    Upload image to server disk
// @route   POST /api/upload/v1/disk
// @access  public
const uploadImageToDisk = asyncHandler(async (req, res) => {
  uploadSingleImageDisk(req, res, function (err) {
    if (err) {
      res.status(400).send({ message: 'Image NOT uploaded: ' + err.message });
    } else {
      res.status(200).send({
        message: 'Image uploaded successfully',
        image: path.sep + UPLOADS_URL + path.sep + `${req.file.filename}`,
      });
    }
  });
});

// ================ Upload to Cloudinary ================
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

// @desc    Upload image to cloudinary
// @route   POST /api/upload/v1/cloudinary
// @access  public
const uploadImageToCloudinary = asyncHandler(async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
    const cldRes = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'auto',
    });
    // console.log('===> cldRes:', cldRes.secure_url);
    res.status(200).send({
      message: 'Image uploaded successfully',
      image: cldRes.secure_url,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: error.message,
    });
  }
});

export { uploadImageToDisk, cloudinarySettings, uploadImageToCloudinary };
