import express, { Request, Response } from 'express';
import { json } from 'body-parser';

const app = express();
app.use(json());

app.get('/api/users/currentuser', (req: Request, res: Response) => {
  res.send('Hello');
});

app.listen(5010, () => {
  console.log('Listening on port 5010');
});
