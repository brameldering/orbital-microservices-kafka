import path from 'path';

import { Request } from 'express';
import { FileFilterCallback } from 'multer';

// Function to check for image file types
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    // Reject file because format is not an image
    cb(new Error('Only image files are allowed'));
  }
};

export default fileFilter;
