import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/api/users/signout', async (req: Request, res: Response) => {
  res.send('Hello Juno - signout');
});

export { router as signoutRouter };
