import pool from '../db/pool.js';

export async function buscarPorEmail(email) {
  const [filas] = await pool.query(
    'SELECT id_usuario, email, password_hash, rol FROM usuarios WHERE email = ?',
    [email]
  );
  return filas[0] ?? null;
}