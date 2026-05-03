const fs = require('fs');
let content = fs.readFileSync('src/Dashboard.jsx', 'utf8');
content = content.replace(/claude-sonnet-4-\d+/g, 'claude-sonnet-4-5');
fs.writeFileSync('src/Dashboard.jsx', content);
console.log('done');
