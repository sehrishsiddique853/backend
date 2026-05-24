const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();



// remote connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// product schema
const productSchema = new mongoose.Schema({
  ProductName: { type: String, required: true },
  FirmName: { type: String, required: true },
  Price: { type: Number, required: true },
  Quantity: { type: Number, required: true },
  ExpiryDate: { type: Date, required: true },
});

const Product = mongoose.model("Product", productSchema);
const app = express();
app.use(express.json());
// insert to database
app.get("/insert", async (req, res) => {
  try {
    const data = fs.readFileSync("productsInformation.json", "utf8");
    const parsedData = JSON.parse(data);
    const formattedData = parsedData.map(item => ({
      FirmName: item.FirmName,
      ProductName: item.ProductName,
      Price: item.Price,
      Quantity: item.Quantity,
      ExpiryDate: new Date(item.ExpiryDate)
    }));

    await Product.insertMany(formattedData);
    res.send("✅ Products added successfully!");
  } catch (error) {
    res.status(500).send(` Error: ${error.message}`);
  }
});
// fetch all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).send(` Error: ${error.message}`);
  }
});
// fetch products within a price range
app.get("/products/price-range", async (req, res) => {
  try {
    const { min, max, name } = req.query;
    const filter = {
      Price: { $gte: Number(min), $lte: Number(max) },
    };
    if (name) filter.ProductName = new RegExp(name, "i");
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).send(` Error: ${error.message}`);

  }
});
// ftch all expired products
app.get("/products/expired", async (req, res) => {
  try {
    const today = new Date();
    const products = await Product.find({ ExpiryDate: { $lt: today } });
    res.json(products);
  } catch (error) {
    res.status(500).send(` Error: ${error.message}`);

  }
});

// ftch products with quantity < 50
app.get("/products/less-than-50", async (req, res) => {
  try {
    const products = await Product.find({ Quantity: { $lt: 50 } });
    res.json(products);
  } catch (error) {
    res.status(500).send(` Error: ${error.message}`);

  }
});

// ftch products of a certain firm
app.get("/products/firm/:name", async (req, res) => {
  try {
    const firmName = req.params.name;
    const products = await Product.find({ FirmName: new RegExp(firmName, "i") });
    res.json(products);
  } catch (error) {
    res.status(500).send(` Error: ${error.message}`);

  }
});

// delete expired products
app.delete("/products/delete-expired", async (req, res) => {
  try {
    const today = new Date();
    const result = await Product.deleteMany({ ExpiryDate: { $lt: today } });
    res.json({
      message: "Deleted expired products",
    });
  } catch (error) {
     res.status(500).send(` Error: ${error.message}`);

  }
});

// update product price by firm or product name
app.put("/products/update", async (req, res) => {
  try {
    const { firm, product, price } = req.query;

    let query = {};
    if (firm) query.FirmName = new RegExp(firm, "i");
    if (product) query.ProductName = new RegExp(product, "i");

    const result = await Product.updateMany(query, {
      $set: { Price: parseFloat(price) },
    });

    res.json({
      message: `Updated products`,
    });
  } catch (error) {
    res.status(500).send(` Error: ${error.message}`);

  }
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  
});
