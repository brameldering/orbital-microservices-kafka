import express, { Request, Response } from 'express';

const router = express.Router();

// @desc    Logout user / clear session cookie
// @route   POST /api/users/v2/signout
// @access  Public
// @req
// @res     Clear session cookie
//      and status(200)
router.post('/api/users/v2/signout', async (req: Request, res: Response) => {
  /*  #swagger.tags = ['Users']
      #swagger.description = 'Clears the Session Cookie containing the JWT'
      #swagger.responses[200] = {
          description: 'Empty object',
      } */
  req.session = null;
  res.send({});
});

export { router as signoutRouter };
