exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the products data from the request body
    const productsData = JSON.parse(event.body);
    
    // Validate the data structure
    if (!productsData.products || !Array.isArray(productsData.products)) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Invalid products data structure' })
      };
    }

    // Log the received data
    console.log('Products data received:', JSON.stringify(productsData, null, 2));
    
    // For Netlify, we can't directly write to files, but we can:
    // 1. Store in environment variables
    // 2. Trigger a webhook
    // 3. Use a database
    // 4. Return the data for manual update
    
    // Store the data in a way that can be retrieved
    const timestamp = new Date().toISOString();
    console.log(`Products updated at ${timestamp}:`, productsData.products.length, 'products');
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Products received successfully',
        count: productsData.products.length,
        timestamp: timestamp,
        note: 'For full functionality, integrate with a database or file system'
      })
    };
    
  } catch (error) {
    console.error('Error processing products:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Failed to process products',
        details: error.message 
      })
    };
  }
};
