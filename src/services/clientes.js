import pool from '../db/pool.js';

export async function listar() {
  const [filas] = await pool.query('SELECT * FROM clientes ORDER BY id_cliente');
  return filas;
}

export async function obtener(id) {
  const [filas] = await pool.query('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
  return filas[0] ?? null;
}

export async function crear({ dni, nombre, apellido, email, telefono }) {
  const [resultado] = await pool.query(
    'INSERT INTO clientes (dni, nombre, apellido, email, telefono) VALUES (?, ?, ?, ?, ?)',
    [dni, nombre, apellido, email ?? null, telefono ?? null]
  );
  return obtener(resultado.insertId);
}

export async function actualizar(id, { dni, nombre, apellido, email, telefono }) {
  const existente = await obtener(id);
  if (!existente) return null;

  await pool.query(
    'UPDATE clientes SET dni = ?, nombre = ?, apellido = ?, email = ?, telefono = ? WHERE id_cliente = ?',
    [dni, nombre, apellido, email ?? null, telefono ?? null, id]
  );
  return obtener(id);
}

export async function borrar(id) {
  const [resultado] = await pool.query('DELETE FROM clientes WHERE id_cliente = ?', [id]);
  return resultado.affectedRows > 0;
}
