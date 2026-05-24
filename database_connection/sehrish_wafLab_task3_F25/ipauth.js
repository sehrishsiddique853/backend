// ipAuth.js
const fs = require("fs");
const prompt = require("prompt");
const validator = require("validator");
const chalk = require("chalk");
const path = require("path");

// Read IP lists
const whiteIPs = fs.readFileSync(path.join(__dirname, "White.txt"), "utf8").split("\n");
const blackIPs = fs.readFileSync(path.join(__dirname, "Black.txt"), "utf8").split("\n");

prompt.start();

prompt.get(["email", "ip"], function (err, result) {
  if (err) return console.error(err);

  const { email, ip } = result;

  // Validate email & IP
  if (!validator.isEmail(email)) {
    console.log(chalk.red("Invalid Email Address!"));
    return;
  }
  if (!validator.isIP(ip, 4)) {
    console.log(chalk.red("Invalid IPv4 Address!"));
    return;
  }

  // Check against lists
  if (blackIPs.includes(ip)) {
    console.log(chalk.bgRed.white("Access Denied: IP is Blacklisted!"));
    return;
  }

  if (whiteIPs.includes(ip)) {
    console.log(chalk.bgGreen.black("Authentication Successful: IP is Whitelisted!"));
    return;
  }

  // Check if network address matches
  let ipParts = ip.split(".");
  let ipNetwork = ipParts.slice(0, 3).join("."); // e.g., 192.168.1

  let networkMatch = whiteIPs.some((allowedIP) => {
    let parts = allowedIP.split(".");
    return ipNetwork === parts.slice(0, 3).join(".");
  });

  if (networkMatch) {
    console.log(chalk.yellow("⚠ Warning: Your IP belongs to an authorized network. Contact Admin."));
    return;
  }

  // Otherwise -> Add to Pending.txt
  fs.appendFileSync("Pending.txt", ip + "\n");
  console.log(chalk.red("Error: IP not recognized. Added to Pending.txt"));
});
