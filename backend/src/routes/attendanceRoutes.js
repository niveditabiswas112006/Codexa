const express = require("express");
const { clockIn, clockOut, getMyAttendance, getAllAttendance } = require("../controllers/attendanceController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect); // Protect all routes

router.post("/clockin", clockIn);
router.post("/clockout", clockOut);
router.get("/my", getMyAttendance);
router.get("/all", authorize("admin", "manager"), getAllAttendance);

module.exports = router;
