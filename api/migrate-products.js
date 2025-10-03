// Simple migration script - just insert one test product
const { sql } = require('@vercel/postgres');

export default async function handler(req, res) {
  try {
    // Test database connection first
    const testResult = await sql`SELECT 1 as test`;
    console.log('Database connection test:', testResult);
    
    // Insert just one simple product to test
    const result = await sql`
      INSERT INTO products (name, price_cents, material, limited, remaining, sold_out, image)
      VALUES ('Test Product', 10000, 'Test Material', false, 10, false, '/test.jpg')
      RETURNING id
    `;
    
    res.status(200).json({ 
      success: true, 
      message: 'Test product inserted successfully',
      productId: result.rows[0].id
    });
    
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({ 
      error: 'Migration failed', 
      details: error.message,
      stack: error.stack
    });
  }
}
