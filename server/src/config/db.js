import { Pool } from 'pg';
import { env, loadEnv } from './env.js';

loadEnv();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.on('connect', () => {
  console.log('[DB] Connection established to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('[DB] Unexpected error on idle PostgreSQL client:', err);
  process.exit(1);
});
