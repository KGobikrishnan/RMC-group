import { pool } from '../config/db.js';
import { calculateCivilEstimateComplete } from '../utils/calculator.js';

// GET all projects
export async function getAllProjects(req, res) {
  try {
    const result = await pool.query(`
      SELECT 
        p.id, 
        p.client_id, 
        c.name as client_name,
        p.title, 
        p.project_code, 
        p.site_address, 
        p.status,
        p.total_builtup_sqft, 
        p.total_cost, 
        p.rate_per_sqft, 
        p.created_at, 
        p.updated_at
      FROM projects p
      LEFT JOIN clients c ON p.client_id = c.id
      ORDER BY p.updated_at DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// GET single project by ID
export async function getProjectById(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        p.*, 
        c.name as client_name,
        c.phone as client_phone,
        c.email as client_email,
        c.location as client_location
      FROM projects p
      LEFT JOIN clients c ON p.client_id = c.id
      WHERE p.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error fetching project:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// CREATE or UPDATE a project
export async function saveProject(req, res) {
  try {
    const {
      id,
      clientId,
      title,
      projectCode,
      siteAddress,
      status,
      estimateData,
      scheduleRates
    } = req.body;

    if (!title || !estimateData || !scheduleRates) {
      return res.status(400).json({ 
        success: false, 
        error: 'title, estimateData, and scheduleRates are required fields' 
      });
    }

    const projectId = id || `proj_${Date.now()}`;
    
    // Server-side calculation verification using audited calculator engine
    const calcResults = calculateCivilEstimateComplete(estimateData, scheduleRates);
    const totalSqft = calcResults?.totalBuiltupArea || 0;
    const totalCost = calcResults?.grandTotalCost || 0;
    const ratePerSqft = totalSqft > 0 ? (totalCost / totalSqft) : 0;

    const queryText = `
      INSERT INTO projects (
        id, client_id, title, project_code, site_address, status,
        total_builtup_sqft, total_cost, rate_per_sqft,
        estimate_data, schedule_rates, calculation_results, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET
        client_id = EXCLUDED.client_id,
        title = EXCLUDED.title,
        project_code = EXCLUDED.project_code,
        site_address = EXCLUDED.site_address,
        status = EXCLUDED.status,
        total_builtup_sqft = EXCLUDED.total_builtup_sqft,
        total_cost = EXCLUDED.total_cost,
        rate_per_sqft = EXCLUDED.rate_per_sqft,
        estimate_data = EXCLUDED.estimate_data,
        schedule_rates = EXCLUDED.schedule_rates,
        calculation_results = EXCLUDED.calculation_results,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const values = [
      projectId,
      clientId || null,
      title,
      projectCode || `RMC-${Date.now().toString().slice(-4)}`,
      siteAddress || '',
      status || 'Draft',
      totalSqft,
      totalCost,
      ratePerSqft,
      JSON.stringify(estimateData),
      JSON.stringify(scheduleRates),
      JSON.stringify(calcResults)
    ];

    const result = await pool.query(queryText, values);
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error saving project:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// DELETE project
export async function deleteProject(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.json({ success: true, message: 'Project deleted successfully', id });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// Run civil calculation directly (Calculation API endpoint)
export function calculateEstimate(req, res) {
  try {
    const { estimateData, scheduleRates } = req.body;
    if (!estimateData || !scheduleRates) {
      return res.status(400).json({ success: false, error: 'estimateData and scheduleRates required' });
    }
    const calculation = calculateCivilEstimateComplete(estimateData, scheduleRates);
    res.json({ success: true, data: calculation });
  } catch (err) {
    console.error('Calculation error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

