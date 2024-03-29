import express, { Response, NextFunction } from 'express';
import generateToken from '../utils/generateToken';
import {
  USERS_URL,
  User,
  IExtendedRequest,
  cacheMiddleware,
  authorize,
  AUTH_APIS,
  checkObjectId,
  ObjectNotFoundError,
} from '@orbital_app/common';

const router = express.Router();

// @desc    Update user
// @route   PUT /api/users/v2/:id
// @access  Admin
// @req     params.id
//          body {name, email, role}
// @res     {user}
//       or status(404).ObjectNotFoundError('User not found')
router.put(
  USERS_URL + '/:id',
  cacheMiddleware,
  (req: IExtendedRequest, res: Response, next: NextFunction) =>
    authorize(AUTH_APIS, req.apiAccessCache || [])(req, res, next),
  checkObjectId,
  async (req: IExtendedRequest, res: Response) => {
    /*  #swagger.tags = ['Users']
      #swagger.description = 'Update user'
      #swagger.security = [{
        bearerAuth: ['admin']
      }]
      #swagger.parameters['id'] = {
            in: 'path',
            description: 'user id',
            required: 'true',
            type: 'string'
      }
      #swagger.parameters['name, email, role'] = {
          in: 'body',
          description: '{name, email, role} info of user',
          required: 'true',
          type: 'object',
      }
      #swagger.responses[200] = {
          description: 'updatedUser',
      }
      #swagger.responses[404] = {
          description: 'ObjectNotFoundError(User not found)',
     } */
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password');
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
      const updatedUser = await user.save();
      if (req.currentUser!.id === userId) {
        generateToken(
          req,
          user.id.toString(),
          updatedUser.name,
          updatedUser.email,
          updatedUser.role
        );
      }
      res.send(updatedUser.toJSON());
    } else {
      throw new ObjectNotFoundError('User not found');
    }
  }
);

export { router as updateUserRouter };
