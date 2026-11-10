import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'RMC',
});

pool.on('connect', () => {
  // Connected client to PostgreSQL
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

