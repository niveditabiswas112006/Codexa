const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    service: { type: String, required: true },
    staff: { type: String, required: true },
    date: { type: String, required: true }, // format YYYY-MM-DD
    timeSlot: { type: String, required: true }, // e.g. "10:00 AM"
    status: {
      type: String,
      enum: ["scheduled", "rescheduled", "cancelled"],
      default: "scheduled"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
