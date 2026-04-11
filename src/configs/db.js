import './loadEnv.js';
import { Pool } from 'pg';


const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),

  // Only needed if you're connecting to a cloud DB that requires SSL.
  // ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});


pool.on('connect', () => {
  console.log('✅ PostgreSQL connected');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL Pool Error:', err);
});

export default pool;
