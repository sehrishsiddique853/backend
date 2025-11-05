const express = require("express");
const router = express.Router();
const { jwtAuthMiddleware } = require("../jwt");
const userController = require(`../controllers/userController`);

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile", jwtAuthMiddleware, userController.getProfile);
router.put("/change-password", jwtAuthMiddleware, userController.changePassword);
module.exports = router;
