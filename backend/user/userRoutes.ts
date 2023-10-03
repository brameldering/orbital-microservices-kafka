import express from 'express';

import { protect, admin } from '../middleware/authMiddleware';
import checkObjectId from '../middleware/checkObjectId';

import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  updatePassword,
  resetPassword,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from './userController';

const router = express.Router();
router.route('/').get(protect, admin, getUsers).post(registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route('/updatepassword').put(protect, updatePassword);
router.route('/resetpassword').put(resetPassword);
router
  .route('/:id')
  .get(protect, admin, checkObjectId, getUserById)
  .put(protect, admin, checkObjectId, updateUser)
  .delete(protect, admin, checkObjectId, deleteUser);

export default router;
