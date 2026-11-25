import express from 'express';
import 'dotenv/config';
import healthRouter from './routes/health.js';
import clientesRouter from './routes/clientes.js';

const app = express();

app.use(express.json());
app.use('/health', healthRouter);
app.use('/clientes', clientesRouter);

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