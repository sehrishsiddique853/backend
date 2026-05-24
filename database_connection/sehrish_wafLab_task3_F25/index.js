// part3
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const FILE = "./users.json";

// Helper to read users
function readUsers() {
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

// Helper to write users
function writeUsers(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// ------------ CRUD APIs ------------ //

// (vi) Get all users
app.get("/api/users", (req, res) => {
  res.json(readUsers());
});

// (ii) Get user by ID
app.get("/api/users/:id", (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id == req.params.id);
  user ? res.json(user) : res.status(404).json({ error: "User not found" });
});

// (vii) Get user by Name
app.get("/api/users/name/:name", (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.name.toLowerCase() === req.params.name.toLowerCase());
  user ? res.json(user) : res.status(404).json({ error: "User not found" });
});

// Create (POST)
app.post("/api/users", (req, res) => {
  const users = readUsers();
  const newUser = { id: Date.now(), ...req.body };
  users.push(newUser);
  writeUsers(users);
  res.status(201).json(newUser);
});

// Update (PATCH)
app.patch("/api/users/:id", (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id == req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  Object.assign(user, req.body);
  writeUsers(users);
  res.json(user);
});

// Update (PUT - replace user)
app.put("/api/users/:id", (req, res) => {
  let users = readUsers();
  let index = users.findIndex(u => u.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "User not found" });
  users[index] = { id: users[index].id, ...req.body };
  writeUsers(users);
  res.json(users[index]);
});

// Delete user by ID
app.delete("/api/users/:id", (req, res) => {
  let users = readUsers();
  let updated = users.filter(u => u.id != req.params.id);
  writeUsers(updated);
  res.json({ message: "User deleted" });
});

// ------------ Extra Functionalities ------------ //

// (i) Delete all users with Class E IP (240.0.0.0 – 255.255.255.254)
app.delete("/api/users/deleteClassE", (req, res) => {
  let users = readUsers();
  users = users.filter(u => {
    let firstOctet = parseInt(u.ip.split(".")[0]);
    return !(firstOctet >= 240 && firstOctet <= 255);
  });
  writeUsers(users);
  res.json({ message: "Class E users deleted" });
});

// (ii) Update org of Class D IP users (224.0.0.0 – 239.255.255.255)
app.patch("/api/users/updateClassD", (req, res) => {
  let users = readUsers();
  users.forEach(u => {
    let firstOctet = parseInt(u.ip.split(".")[0]);
    if (firstOctet >= 224 && firstOctet <= 239) {
      u.organization = "QAU";
    }
  });
  writeUsers(users);
  res.json({ message: "Class D users updated to QAU" });
});

// (iii) Update user by email
app.patch("/api/users/updateByEmail/:email", (req, res) => {
  let users = readUsers();
  let user = users.find(u => u.email === req.params.email);
  if (!user) return res.status(404).json({ error: "User not found" });
  Object.assign(user, req.body);
  writeUsers(users);
  res.json(user);
});

// (iv) Insert new instances into new file
app.post("/api/users/insertNew", (req, res) => {
  const newFile = "./newUsers.json";
  let newUsers = req.body; // expects array of users
  fs.writeFileSync(newFile, JSON.stringify(newUsers, null, 2));
  res.json({ message: "New users saved to newUsers.json" });
});

// (v) Get all users with Class C IP (192.0.0.0 – 223.255.255.255)
app.get("/api/users/classC", (req, res) => {
  let users = readUsers();
  let classCUsers = users.filter(u => {
    let firstOctet = parseInt(u.ip.split(".")[0]);
    return firstOctet >= 192 && firstOctet <= 223;
  });
  res.json(classCUsers);
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
