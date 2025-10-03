// Migration script: Move products from JSON to database
// Run this once to migrate your existing products

import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Read existing products.json
    const productsPath = path.join(process.cwd(), 'assets', 'data', 'products.json');
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    
    if (!productsData.products || !Array.isArray(productsData.products)) {
      return res.status(400).json({ error: 'Invalid products.json format' });
    }

    // Start transaction
    await sql.begin(async (sql) => {
      // Clear existing products
      await sql`DELETE FROM products`;
      
      // Insert products from JSON
      for (const product of productsData.products) {
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
      message: `Migrated ${productsData.products.length} products to database`,
      count: productsData.products.length 
    });

  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({ error: 'Migration failed: ' + error.message });
  }
}
