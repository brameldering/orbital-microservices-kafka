import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/api/users/currentuser', async (req: Request, res: Response) => {
  res.send('Hello Juno - currentuser');
});

export { router as currentUserRouter };
