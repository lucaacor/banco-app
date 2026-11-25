import bcrypt from 'bcrypt';
import pool from '../src/db/pool.js';

const [email, password, rol = 'consulta'] = process.argv.slice(2);

if (!email || !password || !['admin', 'consulta'].includes(rol)) {
  console.error('Uso: node scripts/crear-usuario.js email contraseña [admin|consulta]');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);

await pool.query(
  'INSERT INTO usuarios (email, password_hash, rol) VALUES (?, ?, ?)',
  [email, hash, rol]
);

console.log(`Usuario ${email} creado con rol ${rol}`);
await pool.end();