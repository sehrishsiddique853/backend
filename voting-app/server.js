const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { jwtAuthMiddleware } = require("./jwt");

const bodyParser=require(`body-parser`);
app.use(bodyParser.json());

const connectDB = require("./config/db");
//const User = require("./models/userModel");
//const logRequest = require("./middleware/logger");
//const errorHandler = require("./middleware/errorHandler");
//
const userRoutes = require("./routes/userRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
//const taskRoutes = require("./routes/taskRoutes");

// ===== Connect DB =====
connectDB();

// ====================
// 🔹 Passport Local Strategy
// ====================

const User = require(`./models/userModel`);

passport.use(
  new LocalStrategy(
    { usernameField: "cnic" }, // 👈 tells Passport to look for "cnic" instead of "username"
    async (cnic, password, done) => {
      try {
        console.log("Received credentials:", cnic, password);

        const user = await User.findOne({ cnic });
        if (!user) return done(null, false, { message: "Incorrect CNIC" });

        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch)
          return done(null, false, { message: "Incorrect password" });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

app.get("/", (req, res) => res.json("Task Management API is running..."));
app.use("/user", userRoutes);
app.use("/candidate", candidateRoutes);
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
