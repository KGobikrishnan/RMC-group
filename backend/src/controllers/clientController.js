import { pool } from '../config/db.js';

// GET all clients
export async function getAllClients(req, res) {
  try {
    const result = await pool.query(`
      SELECT 
        c.*,
        COUNT(p.id) as project_count,
        COALESCE(SUM(p.total_cost), 0) as total_portfolio_value
      FROM clients c
      LEFT JOIN projects p ON c.id = p.client_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Error fetching clients:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// CREATE or UPDATE client
export async function saveClient(req, res) {
  try {
    const { id, name, company, role, phone, altPhone, email, location, city, status, address } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Client name is required' });
    }

    const clientId = id || `client_${Date.now()}`;
    const queryText = `
      INSERT INTO clients (id, name, company, role, phone, alt_phone, email, location, city, status, address, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        company = EXCLUDED.company,
        role = EXCLUDED.role,
        phone = EXCLUDED.phone,
        alt_phone = EXCLUDED.alt_phone,
        email = EXCLUDED.email,
        location = EXCLUDED.location,
        city = EXCLUDED.city,
        status = EXCLUDED.status,
        address = EXCLUDED.address,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const result = await pool.query(queryText, [
      clientId, 
      name, 
      company || '',
      role || '',
      phone || '', 
      altPhone || '',
      email || '', 
      location || '', 
      city || '',
      status || 'Active',
      address || ''
    ]);

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error saving client:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// DELETE client
export async function deleteClient(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM clients WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }
    res.json({ success: true, message: 'Client deleted successfully', id });
  } catch (err) {
    console.error('Error deleting client:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

