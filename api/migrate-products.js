// Migration script: Move products from JSON to database
// Run this once to migrate your existing products

const { sql } = require('@vercel/postgres');

export default async function handler(req, res) {
  // Allow both GET and POST for easier testing
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Sample products data (from your JSON file)
    const productsData = {
      products: [
        {
          id: 1,
          name: "No. 01 Bifold Wallet",
          priceCents: 18500,
          material: "Full-grain Italian leather",
          limited: true,
          remaining: 12,
          image: "/assets/images/ava.jpg"
        },
        {
          id: 2,
          name: "No. 02 Card Holder",
          priceCents: 12000,
          material: "Vegetable-tanned leather",
          limited: true,
          remaining: 0,
          soldOut: true,
          image: "assets/images/banner.jpg"
        },
        {
          id: 3,
          name: "No. 03 Zip Wallet",
          priceCents: 22000,
          material: "Full-grain leather with brass zip",
          limited: false,
          remaining: 34,
          image: "assets/images/banner.jpg"
        },
        {
          limited: false,
          remaining: 0,
          soldOut: false,
          name: "trt",
          priceCents: 23234234,
          material: "efssd",
          image: "/assets/images/logo.jpg",
          id: 4
        },
        {
          id: 5,
          name: "234",
          priceCents: 243,
          material: "ewrwer",
          remaining: 3242,
          image: "/assets/images/product-1759512648762.png",
          limited: false,
          soldOut: false
        },
        {
          id: 6,
          name: "234",
          priceCents: 32432,
          material: "leather",
          remaining: 22,
          image: "/assets/images/product-1759512680557.webp",
          limited: true,
          soldOut: false
        }
      ]
    };
    
    if (!productsData.products || !Array.isArray(productsData.products)) {
      return res.status(400).json({ error: 'Invalid products data format' });
    }

    // Start transaction
    await sql.begin(async (sql) => {
      // Clear existing products
      await sql`DELETE FROM products`;
      
      // Insert products from data
      for (const product of productsData.products) {
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
