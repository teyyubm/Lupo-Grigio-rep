// Test database connection
const { sql } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
  try {
    // Simple test query
    const result = await sql`SELECT 1 as test, NOW() as current_time`;
    
    res.status(200).json({ 
      success: true, 
      message: 'Database connection successful',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      error: 'Database connection failed', 
      details: error.message 
    });
  }
};
