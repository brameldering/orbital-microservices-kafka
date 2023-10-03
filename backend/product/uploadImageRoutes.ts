import express from 'express';

import { protect, admin } from '../middleware/authMiddleware';

import { uploadImage } from './uploadImageController';

const router = express.Router();
router.route('/').post(protect, admin, uploadImage);

export default router;
