require('@babel/register')({
  presets: ['@babel/preset-env', '@babel/preset-react']
});
// Need to just check what is exported
const fs = require('fs');
const content = fs.readFileSync('src/config/env.js', 'utf8');
console.log("ENV file content:");
console.log(content);
