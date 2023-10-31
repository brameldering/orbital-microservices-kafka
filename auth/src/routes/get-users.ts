import express, { Request, Response } from 'express';
import { USERS_URL, protect, admin } from '@orbitelco/common';
import { User } from '../userModel';

const router = express.Router();

// @desc    Get all users
// @route   GET /api/users/v2/all
// @access  Admin
// @req
// @res     send(users)
router.get(USERS_URL, protect, admin, async (req: Request, res: Response) => {
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
});

export { router as getUsersRouter };
