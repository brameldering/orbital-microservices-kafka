import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadImage } from './uploadImageController.js';

const router = express.Router();
router.route('/').post(protect, admin, uploadImage);

export default router;
