// API route: GET /api/products
// Get all products from database

import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { rows } = await sql`
      SELECT 
        id,
        name,
        price_cents,
        material,
        remaining,
        image_url,
        is_limited,
        is_sold_out,
        created_at,
        updated_at
      FROM products 
      ORDER BY id ASC
    `;

    // Transform database rows to match frontend format
    const products = rows.map(row => ({
      id: row.id,
      name: row.name,
      priceCents: row.price_cents,
      material: row.material,
      remaining: row.remaining,
      image: row.image_url,
      limited: row.is_limited,
      soldOut: row.is_sold_out,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    res.status(200).json({ products });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}
