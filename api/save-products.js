// API route: POST /api/save-products
// Create or update products in database

const { sql } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ error: 'Invalid products data' });
    }

    // Clear existing products
    await sql`DELETE FROM products`;
    
    // Insert new products one by one
    let insertedCount = 0;
    for (const product of products) {
      try {
        await sql`
          INSERT INTO products (
            id, name, price_cents, material, limited, 
            remaining, sold_out, image
          ) VALUES (
            ${product.id}, ${product.name}, ${product.priceCents}, 
            ${product.material}, ${product.limited || false}, 
            ${product.remaining || 0}, ${product.soldOut || false}, 
            ${product.image || ''}
          )
        `;
        insertedCount++;
      } catch (insertError) {
        console.error(`Error inserting product ${product.id}:`, insertError);
        // Continue with other products
      }
    }

    res.status(200).json({ 
      success: true, 
      message: 'Products saved successfully',
      count: insertedCount,
      total: products.length
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to save products', details: error.message });
  }
};
