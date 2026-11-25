import express from 'express';
import 'dotenv/config';
import healthRouter from './routes/health.js';
import authRouter from './routes/auth.js';
import clientesRouter from './routes/clientes.js';
import { autenticar } from './middleware/auth.js';

if (!process.env.JWT_SECRET) {
  console.error('Falta JWT_SECRET en el archivo .env');
  process.exit(1);
}

const app = express();

app.use(express.json());
app.use('/health', healthRouter);
app.use('/auth', authRouter);
app.use('/clientes', autenticar, clientesRouter);

app.use((err, req, res, next) => {
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'Ya existe un registro con esos datos (por ejemplo, el DNI)' });
  }
  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(409).json({ error: 'No se puede borrar: tiene datos relacionados (por ejemplo, cuentas)' });
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});