// Simple test API endpoint
module.exports = async function handler(req, res) {
  res.status(200).json({ 
    message: 'API endpoint is working!',
    timestamp: new Date().toISOString()
  });
};
