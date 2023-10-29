import express, { Response } from 'express';
import { IExtendedRequest, currentUser } from '@orbitelco/common';

const router = express.Router();

// @desc    Get current user
// @route   GET /api/users/v2/currentuser
// @access  Public
// @req     currentUser object
// @res     status(200).send({ currentUser: req.currentUser || null })
router.get(
  '/api/users/v2/currentuser',
  currentUser,
  (req: IExtendedRequest, res: Response) => {
    /*  #swagger.tags = ['Users']
      #swagger.description = 'Get current user from req.currentUser object'
      #swagger.responses[200] = {
          description: '{ currentUser: req.currentUser || null }',
      } */
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
