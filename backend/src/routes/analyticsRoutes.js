const express = require("express");
const { getSummary, handleAIChat } = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect); // Protect all routes

router.get("/summary", getSummary);
router.post("/ai-chat", handleAIChat);

module.exports = router;
