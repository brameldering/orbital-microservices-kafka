import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/api/users/v2/signout', async (req: Request, res: Response) => {
  req.session = null;
  res.send({});
});

export { router as signoutRouter };
