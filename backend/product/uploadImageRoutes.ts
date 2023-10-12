import express from 'express';

import { protect, admin } from '../middleware/authMiddleware';

import { uploadImage } from './uploadImageController';

const router = express.Router();
router.route('/api/upload/v1/').post(protect, admin, uploadImage);

export default router;
