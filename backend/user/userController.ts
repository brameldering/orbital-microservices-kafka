import { Request, Response } from 'express';
import { IExtendedRequest } from 'types/commonTypes';
import { UserDocument } from 'types/mongoose.gen';

import generateToken from '../general/utils/generateToken';
import asyncHandler from '../middleware/asyncHandler';
import { ExtendedError } from '../middleware/errorMiddleware';

import User from './userModel';

// @desc    Get all users
// @route   GET /api/users/v1
// @access  Private/Admin
// @req
// @res     status(200).json(users)
const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find({});
  res.status(200).json(users);
});

// @desc    Register a new user
// @route   POST /api/users/v1
// @access  Public
// @req     body {name, email, password}
// @res     status(201).json({_id, name, email, isAdmin}
//       or status(400).message:'Invalid user data'
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  // No need to check if user already exists since there is an unique check on the data model
  // The errorMiddleware now returns user friendly error messages
  // for the case when a unique field value already exists
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user && user._id) {
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
//       or status(401).message:'Invalid email or password'
const authUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user: UserDocument | null = await User.findOne({ email });
  if (user && user._id && (await user.matchPassword(password))) {
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
//       or status(404).message:'User not found'
const getUserProfile = asyncHandler(
  async (req: IExtendedRequest, res: Response) => {
    if (!req.user || !req.user._id) {
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
//          body {name, email, password}
// @res     status(200).json({_id, name, email, isAdmin})
//       or status(404).message:'User not found'
const updateUserProfile = asyncHandler(
  async (req: IExtendedRequest, res: Response) => {
    if (!req.user || !req.user._id) {
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
//       or status(404).message:'User not found'
const updatePassword = asyncHandler(
  async (req: IExtendedRequest, res: Response) => {
    if (!req.user || !req.user._id) {
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
//       or status(404).message:'User not found'
const resetPassword = asyncHandler(async (req: Request, res: Response) => {
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
// @access  Private/Admin
// @req     params.id
// @res     status(200).json(user)
//       or status(404).message:'User not found'
const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.status(200).json(user);
  } else {
    throw new ExtendedError('User not found', 404);
  }
});

// @desc    Update user
// @route   PUT /api/users/v1/:id
// @access  Private/Admin
// @req     params.id
//          body {name, email, isAdmin}
// @res     status(200).json({_id, name, email, isAdmin}
//       or status(404).message:'User not found'
const updateUser = asyncHandler(async (req: Request, res: Response) => {
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
// @access  Private/Admin
// @req     params.id
// @res     status(200).json({message})
//       or status(404).message:'User not found'
const deleteUser = asyncHandler(async (req: Request, res: Response) => {
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
