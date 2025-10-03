// Migration script: Move products from JSON to database
// Run this once to migrate your existing products

const { sql } = require('@vercel/postgres');

export default async function handler(req, res) {
  // Allow both GET and POST for easier testing
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Test database connection first
    await sql`SELECT 1 as test`;
    
    // Clear existing products
    await sql`DELETE FROM products`;
    
    // Insert products one by one with proper error handling
    const products = [
      {
        id: 1,
        name: "No. 01 Bifold Wallet",
        price_cents: 18500,
        material: "Full-grain Italian leather",
        limited: true,
        remaining: 12,
        sold_out: false,
        image: "/assets/images/ava.jpg"
      },
      {
        id: 2,
        name: "No. 02 Card Holder",
        price_cents: 12000,
        material: "Vegetable-tanned leather",
        limited: true,
        remaining: 0,
        sold_out: true,
        image: "assets/images/banner.jpg"
      },
      {
        id: 3,
        name: "No. 03 Zip Wallet",
        price_cents: 22000,
        material: "Full-grain leather with brass zip",
        limited: false,
        remaining: 34,
        sold_out: false,
        image: "assets/images/banner.jpg"
      },
      {
        id: 4,
        name: "trt",
        price_cents: 23234234,
        material: "efssd",
        limited: false,
        remaining: 0,
        sold_out: false,
        image: "/assets/images/logo.jpg"
      },
      {
        id: 5,
        name: "234",
        price_cents: 243,
        material: "ewrwer",
        limited: false,
        remaining: 3242,
        sold_out: false,
        image: "/assets/images/product-1759512648762.png"
      },
      {
        id: 6,
        name: "234",
        price_cents: 32432,
        material: "leather",
        limited: true,
        remaining: 22,
        sold_out: false,
        image: "/assets/images/product-1759512680557.webp"
      }
    ];

    let insertedCount = 0;
    for (const product of products) {
      try {
        await sql`
          INSERT INTO products (
            id, name, price_cents, material, limited, 
            remaining, sold_out, image
          ) VALUES (
            ${product.id}, ${product.name}, ${product.price_cents}, 
            ${product.material}, ${product.limited}, 
            ${product.remaining}, ${product.sold_out}, 
            ${product.image}
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
      message: `Successfully migrated ${insertedCount} products to database`,
      count: insertedCount,
      total: products.length
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
