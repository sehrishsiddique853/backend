const os = require('os');
const path = require('path');

// --- OS Uptime Info ---
const uptimeInSeconds = os.uptime();
const uptimeInHours = (uptimeInSeconds / 3600).toFixed(2);
console.log(`System Uptime: ${uptimeInSeconds} seconds (${uptimeInHours} hours)`);

// --- Path Parsing Info ---
const filePath = __filename; // Absolute path of the current file
const parsedPath = path.parse(filePath);

console.log('\nFile Path Information:');
console.log(`Root: ${parsedPath.root}`);
console.log(`Dir: ${parsedPath.dir}`);
console.log(`Base: ${parsedPath.base}`);
console.log(`Ext: ${parsedPath.ext}`);
console.log(`Name: ${parsedPath.name}`);
