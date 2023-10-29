import express, { Request, Response } from 'express';
import { protect, admin } from '@orbitelco/common';
import { User } from '../userModel';

const router = express.Router();

// @desc    Get all users
// @route   GET /api/users/v2
// @access  Admin
// @req
// @res     send(users)
router.get(
  '/api/users/v2/',
  protect,
  admin,
  async (req: Request, res: Response) => {
    /*  #swagger.tags = ['Users']
      #swagger.description = 'Fetch all users'
      #swagger.security = [{
        bearerAuth: ['admin']
      }]
      #swagger.parameters[] = {},
      #swagger.responses[200] = {
          description: 'users',
} */
    const users = await User.find({});
    res.send(users);
  }
);

export { router as getUsersRouter };
