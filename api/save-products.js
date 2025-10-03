// API route: POST /api/products
// Create or update products in database

const { sql } = require('@vercel/postgres');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ error: 'Invalid products data' });
    }

    // Start transaction
    await sql.begin(async (sql) => {
      // Clear existing products
      await sql`DELETE FROM products`;
      
      // Insert new products
      for (const product of products) {
        await sql`
          INSERT INTO products (
            id, name, price_cents, material, remaining, 
            image_url, is_limited, is_sold_out
          ) VALUES (
            ${product.id}, ${product.name}, ${product.priceCents}, 
            ${product.material}, ${product.remaining}, ${product.image}, 
            ${product.limited || false}, ${product.soldOut || false}
          )
        `;
      }
    });

    res.status(200).json({ 
      success: true, 
      message: 'Products saved successfully',
      count: products.length 
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to save products' });
  }
}
