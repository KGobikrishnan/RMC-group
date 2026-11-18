import { spawn, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function ensurePostgresRunning() {
  const rootDir = path.resolve(__dirname, '../../');
  const dataDir = path.resolve(rootDir, '.pgdata');
  const sockDir = path.resolve(rootDir, '.pgsockets');
  const socketPath = path.resolve(sockDir, '.s.PGSQL.5433');

  if (!fs.existsSync(sockDir)) {
    fs.mkdirSync(sockDir, { recursive: true });
  }

  // Check if postgres is already accepting connections
  try {
    execSync(`pg_isready -h "${sockDir}" -p 5433`, { stdio: 'ignore' });
    console.log('PostgreSQL is already running and ready on port 5433.');
    return;
  } catch {
    // Not running, proceed to start
  }

  // If data directory not initialized, initialize it
  if (!fs.existsSync(path.resolve(dataDir, 'base'))) {
    console.log('Initializing local PostgreSQL database cluster in backend/.pgdata...');
    try {
      execSync(`/usr/bin/initdb -D "${dataDir}" -U postgres --auth=trust`, { stdio: 'inherit' });
    } catch (e) {
      console.error('Failed to initdb:', e.message);
    }
  }

  console.log('Starting local PostgreSQL server automatically on port 5433...');
  const pgProcess = spawn('/usr/bin/postgres', [
    '-D', dataDir,
    '-p', '5433',
    '-k', sockDir
  ], {
    detached: true,
    stdio: 'ignore'
  });

  pgProcess.unref();

  // Wait for socket to become ready (up to 10 seconds)
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      execSync(`pg_isready -h "${sockDir}" -p 5433`, { stdio: 'ignore' });
      console.log('PostgreSQL auto-started successfully and is accepting connections!');
      return;
    } catch {
      // Retry
    }
  }

  console.warn('PostgreSQL startup check timed out, attempting to proceed anyway...');
}

