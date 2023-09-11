import express from 'express';
import { protect, admin } from '../../general/middleware/authMiddleware.js';
import { uploadImage } from '../controllers/uploadImageController.js';

const router = express.Router();
router.route('/').post(protect, admin, uploadImage);

export default router;
