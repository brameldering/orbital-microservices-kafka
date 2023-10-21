import express, { Response } from 'express';
import { IExtendedRequest } from '../types/request-types';

import { currentUser } from '../middleware/current-user';

const router = express.Router();

router.get(
  '/api/users/currentuser',
  currentUser,
  (req: IExtendedRequest, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
