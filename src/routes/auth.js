import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { buscarPorEmail } from '../services/usuarios.js';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post('/login', async (req, res) => {
  const datos = loginSchema.safeParse(req.body);
  if (!datos.success) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  const { email, password } = datos.data;
  const usuario = await buscarPorEmail(email);

  const valido = usuario && (await bcrypt.compare(password, usuario.password_hash));
  if (!valido) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = jwt.sign(
    { sub: usuario.id_usuario, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

export default router;