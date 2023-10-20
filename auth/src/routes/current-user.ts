import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/api/users/currentuser', (req: Request, res: Response) => {
  if (!req.session?.jwt) {
    console.log('no jwt in req session');
    console.log(req.session);
    return res.send({ currentUser: null });
  }

  try {
    console.log('trying to verify');
    const payload = jwt.verify(req.session.jwt, process.env.JWT_SECRET!);
    res.send({ currentUser: payload });
  } catch (err) {
    res.send({ currentUser: null });
  }
});

export { router as currentUserRouter };
