import express, { Request, Response } from 'express';
import { USERS_URL } from '@orbitelco/common';
import { User } from '../userModel';

const router = express.Router();

// @desc    Get all users
// @route   GET /api/users/v2
// @access  Admin
// @req
// @res     send(users)
router.get(USERS_URL, async (req: Request, res: Response) => {
  /*  #swagger.tags = ['Users']
      #swagger.description = 'Fetch all users'
      #swagger.security = [{
        bearerAuth: ['admin']
      }]
      #swagger.parameters[] = {},
      #swagger.responses[200] = {
          description: 'users',
} */
  const usersOriginal = await User.find({});
  // map users to json format as defined in user-types userSchema
  const users = usersOriginal.map((user: { toJSON: () => any }) =>
    user.toJSON()
  );
  res.send(users);
});

export { router as getUsersRouter };
