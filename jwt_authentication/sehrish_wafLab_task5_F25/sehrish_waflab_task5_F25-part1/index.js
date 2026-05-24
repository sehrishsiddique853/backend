const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();

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

// Product schema
const productSchema = mongoose.Schema({
    ProductName: {
        type: String,
        required: true
    },
    FirmName: {
        type: String,
        required: true
    },
    Price: {
        type: Number,
        required: true
    },
    Quantity: {
        type: Number,
        required: true
    },
    ExpiryDate: {
        type: Date,
        required: true
    }
});



const Product = mongoose.model("Product", productSchema);

const app = express();
app.use(express.json());



app.get("/",(req,res)=>{
    res.send("hello");
})
app.get("/insert", async (req, res) => {
  try {
    const data = fs.readFileSync("productsInformation.json", "utf8");
    const parsedData = JSON.parse(data);
    await Product.insertMany(parsedData);
    res.send("added products");
  } catch (error) {
    res.status(500).send("Error inserting products");
  }
});

// Fetch all products 
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find(); 
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch certain products within prices range 
app.get('/product/inrange', async (req, res) => {
    try {
        const { min, max, name } = req.query;
        const filteredproduct = {
            Price: { $gte: Number(min), $lte: Number(max) },
        }
        if (name) filteredproduct.ProductName = new RegExp(name, "i");
        const products = await Product.find(filteredproduct);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch all expired products 
app.get("/products/expired", async (req, res) => {
    try {
        const todaydate = new Date();
        const products = await Product.find({ ExpiryDate: { $lt: todaydate } });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch products having a quantity of less than 50 
app.get("/products/less-than-50", async (req, res) => {
    try {
        const products = await Product.find({ Quantity: { $lt: 50 } });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch products of certain firms
app.get("/products/firm/:name", async (req, res) => {
    try {
        const firmname = req.params.name;
        const products = await Product.find({ FirmName: new RegExp(firmname, "i") });  // FIXED: Use variable, not string
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete expired products 
app.delete("/products/delete-expired", async (req, res) => { 
    try {
        const todaydate = new Date();
        const result = await Product.deleteMany({ ExpiryDate: { $lt: todaydate } });  // FIXED: Corrected method name
        res.json({ 
            message: "Deleted expired products",
            deletedCount: result.deletedCount 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update
app.put('/products/update', async (req, res) => {  
    try {
        const { firm, product, price } = req.query;
        
        
        let query = {};
        if (firm) query.FirmName = new RegExp(firm, "i");
        if (product) query.ProductName = new RegExp(product, "i");
        
        const result = await Product.updateMany(
            query, 
            { $set: { Price: parseFloat(price) } }
        );
        
        res.json({
            message: `Updated ${result.modifiedCount} products`,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


const PORT = process.env.PORT||4000 ;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});