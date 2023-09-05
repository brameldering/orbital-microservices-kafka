import path from 'path';
import multer from 'multer';
import fileFilter from './imageFileFilter.js';
import {
  MAX_IMAGE_FILE_SIZE,
  SERVER_DISK_UPLOADS_FOLDER,
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

export { uploadSingleImageToDisk };
