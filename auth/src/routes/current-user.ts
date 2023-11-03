import express, { Response } from 'express';
import { CURRENT_USER_URL, IExtendedRequest } from '@orbitelco/common';

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
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
