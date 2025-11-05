const User = require("../models/userModel");


const passport = require("passport");
const { jwtAuthMiddleware, generateToken } = require("../jwt");

// POST route to register a user
exports.register = async (req, res) => {
  try {
    const data = req.body; // Assuming the request body contains the User data

    // Check if CNIC already exists
    const existing = await User.findOne({ cnic: data.cnic });
    if (existing) {
      return res.status(400).json({ message: "CNIC already exists" });
    }
    // ❌ Prevent multiple admins
    if (data.role === "admin") {
      const existingAdmin = await User.findOne({ role: "admin" });
      if (existingAdmin) {
        return res.status(400).json({ message: "An admin already exists. Only one admin is allowed." });
      }
    }
    // Create a new User document
    const newUser = new User(data);

    // Save the new user to the database
    const response = await newUser.save();
    console.log("User data saved");

    // Create a JWT payload
    const payload = { id: response.id };

    // Generate token
    const token = generateToken(payload);
   
    // Send response
    res.status(201).json({
      message: "User registered successfully",
      response: response,
      token: token
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.login = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info?.message || "Login failed" });
    const payload={
    id:user.id,
   }
    const token = generateToken(payload);

    res.json({ message: "✅ Login successful", user: { username: user.username },token:token });
  })(req, res, next);
};

exports.getProfile = async (req, res) => {
  try {
    // user data comes from JWT middleware (jwtAuthMiddleware)
    const userData = req.user;

    // Extract user ID from token
    const userId = userData.id;

    // Fetch user from DB
    const user = await User.findById(userId).select("-password"); // exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "✅ User profile fetched successfully",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// 🔐 Change Password (Protected)
exports.changePassword = async (req, res) => {
  try {
    // Step 1: Extract user ID from decoded JWT
    const userId = req.user.id;

    // Step 2: Get current & new password from request body
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new password are required" });
    }

    // Step 3: Find user from DB
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Step 4: Compare current password with stored hash
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: "Incorrect current password" });

    // Step 5: Update with new password (will be hashed by pre-save middleware)
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "✅ Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


