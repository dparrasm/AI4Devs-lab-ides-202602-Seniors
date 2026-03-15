import express, { Request, Response, NextFunction } from 'express';
import { candidatesRouter } from './routes/candidates';

export const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hola LTI!');
});

app.use('/candidates', candidatesRouter);

app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  const message = err instanceof Error ? err.message : 'Something broke!';
  res.status(500).json({ error: { message } });
});
