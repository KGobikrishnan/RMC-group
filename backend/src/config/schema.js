import { pool } from './db.js';

export async function initDatabase() {
  const queryText = `
    -- Clients table
    CREATE TABLE IF NOT EXISTS clients (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      email VARCHAR(255),
      location VARCHAR(255),
      address TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Projects table
    CREATE TABLE IF NOT EXISTS projects (
      id VARCHAR(100) PRIMARY KEY,
      client_id VARCHAR(100) REFERENCES clients(id) ON DELETE SET NULL,
      title VARCHAR(255) NOT NULL,
      project_code VARCHAR(100),
      site_address TEXT,
      status VARCHAR(50) DEFAULT 'Draft',
      total_builtup_sqft NUMERIC(12, 2) DEFAULT 0,
      total_cost NUMERIC(14, 2) DEFAULT 0,
      rate_per_sqft NUMERIC(10, 2) DEFAULT 0,
      estimate_data JSONB NOT NULL,
      schedule_rates JSONB NOT NULL,
      calculation_results JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Rate Templates (Rate Master presets)
    CREATE TABLE IF NOT EXISTS rate_masters (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      is_default BOOLEAN DEFAULT false,
      rates JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Create index on project JSONB fields for fast searching
    CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
    CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
  `;

  try {
    await pool.query(queryText);
    console.log('PostgreSQL: Schema initialized successfully in database RMC');
  } catch (err) {
    console.error('PostgreSQL: Error initializing schema:', err);
    throw err;
  }
}

