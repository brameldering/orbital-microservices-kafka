import express from 'express';
import { protect, admin } from '../../general/middleware/authMiddleware.js';
import { configFileUploadCloudinary } from '../fileUploadHelpers/uploadToCloudinary.js';
import { uploadImageController } from '../controllers/fileUploadController.js';

const router = express.Router();
router
  .route('/')
  .post(protect, admin, configFileUploadCloudinary, uploadImageController);

export default router;
