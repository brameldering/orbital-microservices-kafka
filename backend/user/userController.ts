import { Request, Response } from 'express';
import { IExtendedRequest } from 'types/commonTypes';
import { UserDocument } from 'types/mongoose.gen';

import generateToken from '../general/utils/generateToken';
import asyncHandler from '../middleware/asyncHandler';
import { ExtendedError } from '../middleware/errorMiddleware';

import User from './userModel';

// @desc    Get all users
// @route   GET /api/users/v1
// @access  Admin
// @req
// @res     status(200).json(users)
const getUsers = asyncHandler(async (req: Request, res: Response) => {
  /*  #swagger.tags = ['Users']
      #swagger.description = 'Fetch all users'
      #swagger.security = [{
        bearerAuth: ['admin']
      }]
      #swagger.parameters[] = {},
      #swagger.responses[200] = {
          description: 'json(users)',
} */
  const users = await User.find({});
  res.status(200).json(users);
});

// @desc    Register a new user
// @route   POST /api/users/v1
// @access  Public
// @req     body {name, email, password}
// @res     status(201).json({_id, name, email, isAdmin}
//       or status(400).json({ message: 'Invalid user data' })
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  /*  #swagger.tags = ['Users']
      #swagger.description = 'Register a new user'
      #swagger.parameters['name, email, password'] = {
          in: 'body',
          description: '{name, email, password} info of user',
          required: 'true',
          type: 'object',
      }
      #swagger.responses[201] = {
          description: 'json({ _id, name, email, isAdmin })',
      }
      #swagger.responses[400] = {
          description: 'json({ message: Invalid user data })',
     } */
  const { name, email, password } = req.body;
  // No need to check if user already exists since there is an unique check on the data model
  // The errorMiddleware now returns user friendly error messages
  // for the case when a unique field value already exists
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user?._id) {
    generateToken(res, user._id.toString());
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    throw new ExtendedError('Invalid user data', 400);
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/v1/auth
// @access  Public
// @req     body {email, password}
// @res     cookie('jwt', token, {httpOnly, secure, sameSite, maxAge});
//      and status(200).json({_id, name, email, isAdmin}
//       or status(401).json({ message: 'Invalid email or password' })
const authUser = asyncHandler(async (req: Request, res: Response) => {
  /*  #swagger.tags = ['Users']
      #swagger.description = 'Auth user & get token using JSON Web Token.  On succesful authentication sets an HTTP Only Cookie with the encrypted jwt token'
      #swagger.parameters['email, password'] = {
          in: 'body',
          description: '{email, password} info of user',
          required: 'true',
          type: 'object',
      }
      #swagger.responses[200] = {
          description: 'json({ _id, name, email, isAdmin })',
      }
      #swagger.responses[401] = {
          description: 'json({ message: Invalid email or password })',
     } */
  const { email, password } = req.body;
  const user: UserDocument | null = await User.findOne({ email });
  if (user?._id && (await user.matchPassword(password))) {
    generateToken(res, user._id.toString());
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    throw new ExtendedError('Invalid email or password', 401);
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/v1/logout
// @access  Public
// @req
// @res     cookie('jwt', '', {httpOnly, secure, sameSite, expires})
//      and status(200).json({ message: 'Logged out' })
const logoutUser = (req: Request, res: Response) => {
  /*  #swagger.tags = ['Users']
      #swagger.description = 'Clears the jwt HTTP Only Cookie'
      #swagger.responses[200] = {
          description: 'json({ message: Logged out })',
      } */
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out' });
};

// @desc    Get user profile
// @route   GET /api/users/v1/profile
// @access  Private
// @req     user._id
// @res     status(200).json({_id, name, email, isAdmin})
//       or status(401).json({ message: 'Not logged in' })
//       or status(404).json({ message: 'User not found'})
const getUserProfile = asyncHandler(
  async (req: IExtendedRequest, res: Response) => {
    /*  #swagger.tags = ['Users']
      #swagger.description = 'Get user profile'
      #swagger.security = [{
        bearerAuth: ['user']
      }]
      #swagger.parameters['user._id'] = {
              in: 'request',
              description: 'user._id, will automatically be in the request object if the user is logged in',
              required: 'true',
              type: 'string',
      }
      #swagger.responses[201] = {
          description: 'json({ _id, name, email, isAdmin })',
      }
      #swagger.responses[401] = {
          description: 'json({ message: Not logged in })',
      }
      #swagger.responses[404] = {
          description: 'json({ message: User not found })',
     } */
    if (!req.user?._id) {
      throw new ExtendedError('Not logged in', 401);
    }
    const user = await User.findById(req.user._id);
    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      throw new ExtendedError('User not found', 404);
    }
  }
);

// @desc    Update user profile (name, email)
// @route   PUT /api/users/v1/profile
// @access  Private
// @req     user._id
//          body {name, email}
// @res     status(200).json({_id, name, email, isAdmin})
//       or status(401).json({ message: 'Not logged in' })
//       or status(404).json({ message: 'User not found'})
const updateUserProfile = asyncHandler(
  async (req: IExtendedRequest, res: Response) => {
    /*  #swagger.tags = ['Users']
      #swagger.description = 'Update user profile (name, email)'
      #swagger.security = [{
        bearerAuth: ['user']
      }]
      #swagger.parameters['user._id'] = {
              in: 'request',
              description: 'user._id, will automatically be in the request object if the user is logged in',
              required: 'true',
              type: 'string',
      }
      #swagger.parameters['name, email'] = {
          in: 'body',
          description: '{name, email} info of user',
          required: 'true',
          type: 'object',
      }
      #swagger.responses[200] = {
          description: 'json({ _id, name, email, isAdmin })',
      }
      #swagger.responses[401] = {
          description: 'json({ message: Not logged in })',
      }
      #swagger.responses[404] = {
          description: 'json({ message: User not found })',
     } */
    if (!req.user?._id) {
      throw new ExtendedError('Not logged in', 401);
    }
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      const updatedUser = await user.save();
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      throw new ExtendedError('User not found', 404);
    }
  }
);

// @desc    Update user password
// @route   PUT /api/users/v1/password
// @access  Private
// @req     user._id
//          body {currentPassword, newPassword}
// @res     status(200).json({_id, name, email, isAdmin})
//       or status(401).json({ message: 'Not logged in' })
//       or status(404).json({ message: 'User not found'})
const updatePassword = asyncHandler(
  async (req: IExtendedRequest, res: Response) => {
    /*  #swagger.tags = ['Users']
      #swagger.description = 'Update user password'
      #swagger.security = [{
        bearerAuth: ['user']
      }]
      #swagger.parameters['user._id'] = {
              in: 'request',
              description: 'user._id, will automatically be in the request object if the user is logged in',
              required: 'true',
              type: 'string',
      }
      #swagger.parameters['currentPassword, newPassword'] = {
          in: 'body',
          description: '{currentPassword, newPassword} info of user',
          required: 'true',
          type: 'object',
      }
      #swagger.responses[200] = {
          description: 'json({ _id, name, email, isAdmin })',
      }
      #swagger.responses[400] = {
          description: 'json({ message: New password is the same as current password })',
      }
      #swagger.responses[401] = {
          description: 'json({ message: Current password is not correct })',
      }
      #swagger.responses[404] = {
          description: 'json({ message: User not found })',
     } */
    if (!req.user?._id) {
      throw new ExtendedError('Not logged in', 401);
    }

    const user: UserDocument | null = await User.findById(req.user._id);
    if (user) {
      const { currentPassword, newPassword } = req.body;
      if (currentPassword !== newPassword) {
        if (await user.matchPassword(currentPassword)) {
          user.password = newPassword;
          const updatedUser = await user.save();
          res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
          });
        } else {
          throw new ExtendedError('Current password is not correct', 401);
        }
      } else {
        throw new ExtendedError(
          'New password is the same as current password',
          400
        );
      }
    } else {
      throw new ExtendedError('User not found', 404);
    }
  }
);

// @desc    Reset user password
// @route   PUT /api/users/v1/resetpassword
// @access  Private
// @req     body {email}
// @res     status(200).message:'Password has been reset'
//       or status(404).json({ message: 'User not found'})
const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  /*  #swagger.tags = ['Users']
      #swagger.description = 'Reset user password'
      #swagger.security = [{
        bearerAuth: ['user']
      }]
      #swagger.parameters['email'] = {
          in: 'body',
          description: '{email} info of user',
          required: 'true',
          type: 'object',
      }
      #swagger.responses[200] = {
          description: 'json({ _id, name, email, isAdmin })',
      }
      #swagger.responses[404] = {
          description: 'json({ message: User not found })',
     } */
  if (!process.env.DEFAULT_RESET_PASSWORD) {
    throw new ExtendedError(
      'DEFAULT_RESET_PASSWORD setting is missing from .env file.'
    );
  }
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    user.password = process.env.DEFAULT_RESET_PASSWORD;
    await user.save();
    res.status(200).json({
      message: 'Password has been reset',
    });
  } else {
    throw new ExtendedError('This email address is not known to us', 404);
  }
});

// @desc    Get user by ID
// @route   GET /api/users/v1/:id
// @access  Admin
// @req     params.id
// @res     status(200).json(user)
//       or status(404).json({ message: 'User not found'})
const getUserById = asyncHandler(async (req: Request, res: Response) => {
  /*  #swagger.tags = ['Users']
      #swagger.description = 'Get user by ID'
      #swagger.security = [{
        bearerAuth: ['admin']
      }]
      #swagger.parameters['id'] = {
            in: 'path',
            description: 'user id',
            required: 'true',
            type: 'string'
      }
      #swagger.responses[200] = {
          description: 'json(user)',
      }
      #swagger.responses[404] = {
          description: 'json({ message: User not found })',
     } */
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.status(200).json(user);
  } else {
    throw new ExtendedError('User not found', 404);
  }
});

// @desc    Update user
// @route   PUT /api/users/v1/:id
// @access  Admin
// @req     params.id
//          body {name, email, isAdmin}
// @res     status(200).json({_id, name, email, isAdmin}
//       or status(404).json({ message: 'User not found'})
const updateUser = asyncHandler(async (req: Request, res: Response) => {
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
      #swagger.parameters['name, email, isAdmin'] = {
          in: 'body',
          description: '{name, email, isAdmin} info of user',
          required: 'true',
          type: 'object',
      }
      #swagger.responses[200] = {
          description: 'json({ _id, name, email, isAdmin })',
      }
      #swagger.responses[404] = {
          description: 'json({ message: User not found })',
     } */
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);
    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    throw new ExtendedError('User not found', 404);
  }
});

// @desc    Delete user
// @route   DELETE /api/users/v1/:id
// @access  Admin
// @req     params.id
// @res     status(200).json({ message: User removed })
//       or status(404).json({ message: User not found })
const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  /*  #swagger.tags = ['Users']
      #swagger.description = 'Delete user'
      #swagger.security = [{
        bearerAuth: ['admin']
      }]
      #swagger.parameters['id'] = {
            in: 'path',
            description: 'user id',
            required: 'true',
            type: 'string'
      }
      #swagger.responses[200] = {
          description: 'json({ message: User removed })',
      }
      #swagger.responses[404] = {
          description: 'json({ message: User not found })',
     } */
  const user = await User.findById(req.params.id);
  if (user) {
    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: 'User removed' });
  } else {
    throw new ExtendedError('User not found', 404);
  }
});

export {
  getUsers,
  registerUser,
  authUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  updatePassword,
  resetPassword,
  getUserById,
  updateUser,
  deleteUser,
};
