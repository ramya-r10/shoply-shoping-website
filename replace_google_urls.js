const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');
const updated = content.replace(/https:\/\/share\.google\/([-_A-Za-z0-9]+)/g, (_, id) => {
  return `https://drive.google.com/uc?export=view&id=${id}`;
});
fs.writeFileSync(filePath, updated, 'utf8');
console.log('Updated share.google URLs to direct Drive URLs in src/App.jsx');
