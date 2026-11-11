import { pool } from './db.js';
import bcrypt from 'bcryptjs';

export async function initDatabase() {
  const queryText = `
    -- Users table for authentication
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(100) PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      full_name VARCHAR(255) DEFAULT 'System Administrator',
      role VARCHAR(50) DEFAULT 'admin',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Clients table
    CREATE TABLE IF NOT EXISTS clients (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      company VARCHAR(255),
      role VARCHAR(255),
      phone VARCHAR(50),
      alt_phone VARCHAR(50),
      email VARCHAR(255),
      location VARCHAR(255),
      city VARCHAR(255),
      status VARCHAR(50) DEFAULT 'Active',
      address TEXT,
      basic_info JSONB DEFAULT '{}'::jsonb,
      site_assessment JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Projects table
    CREATE TABLE IF NOT EXISTS projects (
      id VARCHAR(100) PRIMARY KEY,
      client_id VARCHAR(100) REFERENCES clients(id) ON DELETE SET NULL,
      title VARCHAR(255) NOT NULL,
      project_code VARCHAR(100),
      project_type VARCHAR(100) DEFAULT 'Residential Villa',
      site_address TEXT,
      status VARCHAR(50) DEFAULT 'Draft',
      stage VARCHAR(100) DEFAULT 'Initial Takeoff',
      total_builtup_sqft NUMERIC(12, 2) DEFAULT 0,
      gf_plinth_sqft NUMERIC(12, 2) DEFAULT 0,
      floors VARCHAR(100) DEFAULT 'G + 1 Floors',
      columns_count INT DEFAULT 8,
      total_cost NUMERIC(14, 2) DEFAULT 0,
      direct_cost NUMERIC(14, 2) DEFAULT 0,
      rate_per_sqft NUMERIC(10, 2) DEFAULT 0,
      completion_date VARCHAR(100),
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

    // Seed default admin user (admin / admin123) if not present
    const checkUser = await pool.query('SELECT id FROM users WHERE username = $1', ['admin']);
    if (checkUser.rows.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      await pool.query(`
        INSERT INTO users (id, username, password_hash, full_name, role)
        VALUES ($1, $2, $3, $4, $5)
      `, ['user_admin_01', 'admin', hashedPassword, 'Er. M. Jahir Hussain', 'admin']);
      console.log('PostgreSQL: Seeded default admin user (admin / admin123) into database RMC');
    }
  } catch (err) {
    console.error('PostgreSQL: Error initializing schema:', err);
    throw err;
  }
}

