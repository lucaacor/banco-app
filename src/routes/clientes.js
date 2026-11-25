import { Router } from 'express';
import { z } from 'zod';
import * as clientes from '../services/clientes.js';
import { exigirRol } from '../middleware/auth.js';
const router = Router();

const clienteSchema = z.object({
  dni: z.string().regex(/^\d{7,8}$/, 'El DNI debe tener 7 u 8 dígitos'),
  nombre: z.string().trim().min(1).max(45),
  apellido: z.string().trim().min(1).max(45),
  email: z.string().email().max(45).optional(),
  telefono: z.string().max(20).optional(),
});

function leerId(texto) {
  const id = Number(texto);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validar(req, res) {
  const resultado = clienteSchema.safeParse(req.body);
  if (!resultado.success) {
    res.status(400).json({
      error: 'Datos inválidos',
      detalles: resultado.error.issues.map((i) => ({
        campo: i.path.join('.'),
        mensaje: i.message,
      })),
    });
    return null;
  }
  return resultado.data;
}

router.get('/', async (req, res) => {
  res.json(await clientes.listar());
});

router.get('/:id', async (req, res) => {
  const id = leerId(req.params.id);
  if (!id) return res.status(400).json({ error: 'ID inválido' });

  const cliente = await clientes.obtener(id);
  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
  res.json(cliente);
});

router.post('/', exigirRol('admin'), async (req, res) => {
  const datos = validar(req, res);
  if (!datos) return;

  const cliente = await clientes.crear(datos);
  res.status(201).json(cliente);
});

router.put('/:id', async (req, res) => {
  const id = leerId(req.params.id);
  if (!id) return res.status(400).json({ error: 'ID inválido' });

  const datos = validar(req, res);
  if (!datos) return;

  const cliente = await clientes.actualizar(id, datos);
  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
  res.json(cliente);
});

router.delete('/:id', async (req, res) => {
  const id = leerId(req.params.id);
  if (!id) return res.status(400).json({ error: 'ID inválido' });

  const borrado = await clientes.borrar(id);
  if (!borrado) return res.status(404).json({ error: 'Cliente no encontrado' });
  res.status(204).send();
});

export default router;
