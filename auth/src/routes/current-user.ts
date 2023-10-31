import express, { Response } from 'express';
import { IExtendedRequest } from '@orbitelco/common';
import { CURRENT_USER_URL } from '../constants';

const router = express.Router();

// @desc    Get current user
// @route   GET /api/users/v2/currentuser
// @access  Public
// @req     currentUser object
// @res     status(200).send({ currentUser: req.currentUser || null })
router.get(CURRENT_USER_URL, (req: IExtendedRequest, res: Response) => {
  /*  #swagger.tags = ['Users']
      #swagger.description = 'Get current user from req.currentUser object'
      #swagger.responses[200] = {
          description: '{ currentUser: req.currentUser || null }',
      } */
  // console.log(' req.currentUser', req.currentUser);
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
