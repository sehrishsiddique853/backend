const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();

const requests={};
const window=60000;
const max=20;
const ratelimiting=(req,res,next)=>{
    const ip=req.ip;
    if(!requests[ip]){
      requests[ip]={count:1, startime:Date.now()};
    }else{
  const currntime=Date.now();
  const totaltime=currntime-requests[ip].startime;
  if(totaltime<window){
    requests[ip].count++;
  }else{
    requests[ip].count=1;
    requests[ip].startime=Date.now();
  }
    }
    if(requests[ip].count>max){
         return res.status(429).json({
      error: "requests exceeded"
    });
    }
    next();}

// Logging Middleware
// ----- Logging Middleware -----
const loggingmiddleware = (req, res, next) => {
  const ip = req.ip;
  const method = req.method;
  const urlpath = req.originalUrl;
  const currenttime = new Date().toISOString();

  const log = `[${currenttime}] ${ip} ${method} ${urlpath}\n`;
  console.log(log.trim());

  fs.appendFile("requests.log", log, (err) => {
    if (err) console.error("Error writing log:", err);
  });

  next();
};


// Local connection 
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('connected', () => {
    console.log("Connected to MongoDB");
});

db.on('disconnected', () => {
    console.log("Disconnected from MongoDB");
});

db.on('error', (err) => {  // Added error parameter
    console.log("MongoDB connection error:", err);
});

const taskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    Status: {
        type: String,
        default: 'pending'
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
});

const Task =mongoose.model("Task",taskSchema);

const app = express();
app.use(express.json());
app.use(ratelimiting);
app.use(loggingmiddleware);

app.get("/",async (req,res)=>{
   try{
        
        res.json("tasks");
   }catch(err){
    res.status(500).json({error:err.message});
   }
});
//get all

app.get("/tasks",async (req,res)=>{
   try{
        const tasks=await Task.find();
        res.json(tasks);
   }catch(err){
    res.status(500).json({error:err.message});
   }
});

//get by id
app.get("/tasks/:id",async  (req,res)=>{
   try{
       const task= await Task.findById(req.params.id);
       if(!task){
        res.status(404).json({message:"task not found!!"})
       }
       res.json(task);
   }catch(err){
    res.status(500).json({error:err.message});
   }
});

//post
app.post("/tasks",async (req,res)=>{
 try{
    const task=new Task({
        title: req.body.title,
        description: req.body.description,
        Status: req.body.Status
    });
    const newtask=await task.save();
    res.status(201).json({message:"inserted successfully"});
 }catch(err){
    res.status(400).json({error:err.message});
   }
});

//post multiple
app.post("/tasks/mult",async (req,res)=>{
    try{
      const tasks = await Task.insertMany(req.body);
      res.status(201).json({message:"inserted successfully",
        tasks:tasks
      });
    }catch(err){
    res.status(400).json({error:err.message});
   }
})

const port = process.env.PORT||3000 ;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});