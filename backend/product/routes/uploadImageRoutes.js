import express from 'express';
import { protect, admin } from '../../general/middleware/authMiddleware.js';

import {
  uploadImageToDisk,
  cloudinarySettings,
  uploadImageToCloudinary,
} from '../controllers/fileUploadController.js';

const router = express.Router();
router.route('/disk').post(protect, admin, uploadImageToDisk);
router
  .route('/cloudinary')
  .post(protect, admin, cloudinarySettings, uploadImageToCloudinary);

// ADD DELETE

export default router;
