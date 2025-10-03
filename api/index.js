// Serve the main index.html file
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    const indexPath = path.join(__dirname, '..', 'index.html');
    const content = fs.readFileSync(indexPath, 'utf8');
    
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(content);
  } catch (error) {
    res.status(404).json({ error: 'File not found' });
  }
};
