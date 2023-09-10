import express from 'express';
import { protect, admin } from '../../general/middleware/authMiddleware.js';
import { configFileUploadCloudinary } from '../fileUploadHelpers/uploadImageToCloudinary.js';
import { uploadImageController } from '../controllers/uploadImageController.js';

const router = express.Router();
router
  .route('/')
  .post(protect, admin, configFileUploadCloudinary, uploadImageController);

export default router;
