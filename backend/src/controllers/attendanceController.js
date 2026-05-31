const Attendance = require("../models/Attendance");

const clockIn = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD local/UTC date identifier

    let record = await Attendance.findOne({ user: req.user.id, date: today });
    if (record) {
      return res.status(400).json({ message: "Already clocked in today" });
    }

    const now = new Date();
    // Check if late (e.g. after 09:15 AM)
    let status = "present";
    const cutoff = new Date();
    cutoff.setHours(9, 15, 0, 0);
    if (now > cutoff) {
      status = "late";
    }

    record = await Attendance.create({
      user: req.user.id,
      date: today,
      clockIn: now,
      status
    });

    res.status(201).json({ success: true, record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const clockOut = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const record = await Attendance.findOne({ user: req.user.id, date: today });
    if (!record) {
      return res.status(400).json({ message: "You need to clock in first" });
    }

    if (record.clockOut) {
      return res.status(400).json({ message: "Already clocked out today" });
    }

    record.clockOut = new Date();
    await record.save();

    res.status(200).json({ success: true, record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyAttendance = async (req, res) => {
  try {
    const logs = await Attendance.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAttendance = async (req, res) => {
  try {
    // Only managers or admin can view all attendance logs
    const logs = await Attendance.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { clockIn, clockOut, getMyAttendance, getAllAttendance };
