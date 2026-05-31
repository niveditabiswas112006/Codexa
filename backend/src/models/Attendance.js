const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String, // format YYYY-MM-DD
      required: true,
    },
    clockIn: { type: Date },
    clockOut: { type: Date },
    status: {
      type: String,
      enum: ["present", "absent", "late", "leave"],
      default: "present",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
