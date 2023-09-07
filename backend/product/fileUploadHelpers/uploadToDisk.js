import path from 'path';
import multer from 'multer';
import fs from 'fs';
import { promisify } from 'util';
import fileFilter from './imageFileFilter.js';
import asyncHandler from '../../general/middleware/asyncHandler.js';
import {
  MAX_IMAGE_FILE_SIZE,
  SERVER_DISK_UPLOADS_FOLDER,
  UPLOADS_URL,
} from '../../constantsBackend.js';

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

const uploadToDisk = multer({
  storage: diskStorage,
  limits: { fileSize: MAX_IMAGE_FILE_SIZE },
  fileFilter,
});
const uploadSingleImageToDisk = uploadToDisk.single('image');

const uploadImageToDisk = asyncHandler(async (req, res) => {
  uploadToDisk.single('image')(req, res, function (err) {
    if (err) {
      res.status(400).send({ message: 'Image NOT uploaded: ' + err.message });
    } else {
      res.status(200).send({
        message: 'Image uploaded successfully',
        image: path.sep + UPLOADS_URL + path.sep + `${req.file.filename}`,
      });
    }
    // return {
    //   message: 'Image uploaded successfully',
    //   image: path.sep + UPLOADS_URL + path.sep + `${req.file.filename}`,
    // };
  });
});

const removeImageFromDisk = async (filePath) => {
  const unlinkAsync = promisify(fs.unlink);
  await unlinkAsync(filePath);
};

export { uploadImageToDisk, removeImageFromDisk };
