
const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();


const requests = {};
const window = 60000;
const max = 20; 

const ratelimiting = (req, res, next) => {
  const ip = req.ip;

  if (!requests[ip]) {
    requests[ip] = { count: 1, starttime: Date.now() };
  } else {
    const currenttime = Date.now();
    const totaltime = currenttime - requests[ip].starttime;

    if (totaltime < window) {
      requests[ip].count++;
    } else {
      requests[ip].count = 1;
      requests[ip].starttime = Date.now();
    }
  }

  if (requests[ip].count > max) {
    return res.status(429).json({
      error: "Too many requests. Please try again later.",
    });
  }

  next();
};

const loggingmiddleware = (req, res, next) => {
  const ip = req.ip;
  const method = req.method;
  const urlpath = req.originalUrl;
  const currenttime = new Date().toISOString();

  const log = `[${currenttime}] ${ip} ${method} ${urlpath}\n`;
  console.log(log.trim());

  // Save to log file
  fs.appendFile("requests.log", log, (err) => {
    if (err) console.error("Error writing log:", err);
  });

  next();
};


mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
   
  })
  .then(() => console.log("Connected"))
  .catch((err) => console.error("Connection Error:", err));

const db = mongoose.connection;
db.on("disconnected", () => console.log("⚠️ MongoDB Disconnected"));


const taskSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  Status: {
    type: String,
    default: "pending",
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
});

const Task = mongoose.model("Task", taskSchema);


const app = express();
app.use(express.json());
app.use(ratelimiting);
app.use(loggingmiddleware);



app.get("/", async (req, res) => {
  res.json("Task Management API is running...");
});

// Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get task by ID
app.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create single task
app.post("/tasks", async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title,
      description: req.body.description,
      Status: req.body.Status,
    });
    await task.save();
    res.status(201).json({ message: "Task created successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Insert multiple tasks
app.post("/tasks/mult", async (req, res) => {
  try {
    const tasks = await Task.insertMany(req.body);
    res.status(201).json({
      message: "Tasks inserted successfully",
      tasks: tasks,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
