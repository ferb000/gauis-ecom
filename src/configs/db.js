import './loadEnv.js';
import { Pool } from 'pg';


const connectionString = process.env.DATABASE_URL || process.env.DB_CONNECTION_STRING;

const poolConfig = connectionString
  ? { connectionString }
  : {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
    };

const pool = new Pool({
  ...poolConfig,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

pool.on('connect', () => {
  console.log('✅ PostgreSQL connected');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL Pool Error:', err);
});

export default pool;
