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
router.route('/api/users/v1/').get(protect, admin, getUsers).post(registerUser);
router.post('/api/users/v1/auth', authUser);
router.post('/api/users/v1/logout', logoutUser);
router
  .route('/api/users/v1/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route('/api/users/v1/updatepassword').put(protect, updatePassword);
router.route('/api/users/v1/resetpassword').put(resetPassword);
router
  .route('/api/users/v1/:id')
  .get(protect, admin, checkObjectId, getUserById)
  .put(protect, admin, checkObjectId, updateUser)
  .delete(protect, admin, checkObjectId, deleteUser);

export default router;
