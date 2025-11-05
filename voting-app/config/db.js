const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to Remote MongoDB");
  } catch (err) {
    console.error(" MongoDB Connection Error:", err);
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => console.log("⚠️ MongoDB Disconnected"));
};

module.exports = connectDB;
