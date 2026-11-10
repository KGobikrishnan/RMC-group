import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './config/db.js';
import { initDatabase } from './config/schema.js';
import projectRoutes from './routes/projectRoutes.js';
import clientRoutes from './routes/clientRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbRes = await pool.query('SELECT NOW() as current_time, current_database() as database');
    res.json({
      status: 'healthy',
      service: 'RMC Civil Estimation Backend',
      database: dbRes.rows[0].database,
      db_time: dbRes.rows[0].current_time
    });
  } catch (err) {
    res.status(500).json({ status: 'unhealthy', error: err.message });
  }
});

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/clients', clientRoutes);

// Start server and initialize PostgreSQL
async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 RMC Backend Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();

