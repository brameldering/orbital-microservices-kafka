import express from 'express';
import { protect, admin } from '../../general/middleware/authMiddleware.js';

import uploadImageController from '../controllers/fileUploadController.js';

const router = express.Router();
router.route('/').post(protect, admin, uploadImageController);

export default router;
