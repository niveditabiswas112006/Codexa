const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
    value: { type: Number, required: true, default: 0 },
    stage: {
      type: String,
      enum: ["new", "proposal", "negotiation", "won", "lost"],
      default: "new",
    },
    notes: { type: String },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deal", dealSchema);
