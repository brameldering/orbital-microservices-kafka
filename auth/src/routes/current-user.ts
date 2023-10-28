import express, { Response } from 'express';
import { IExtendedRequest, currentUser } from '@orbitelco/common';

const router = express.Router();

router.get(
  '/api/users/v2/currentuser',
  currentUser,
  (req: IExtendedRequest, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
