const express = require("express");
const router = express.Router();
const { jwtAuthMiddleware } = require("../jwt");
const candidateController = require("../controllers/candidateController");

// 🧩 All candidate operations require JWT (and admin check inside)
router.post("/", jwtAuthMiddleware, candidateController.addcandidate);
router.get("/",  candidateController.getcandidates);
router.put("/:candidateId", jwtAuthMiddleware, candidateController.updatecandidate);
router.delete("/:candidateId", jwtAuthMiddleware, candidateController.deleteCandidate);
router.post("/vote/:candidateId",jwtAuthMiddleware,candidateController.makevote);
router.get("/vote/count",candidateController.getvote);
module.exports = router;
