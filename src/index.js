import express from 'express';
import 'dotenv/config';
import healthRouter from './routes/health.js';

const app = express();

app.use(express.json());
app.use('/health', healthRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});