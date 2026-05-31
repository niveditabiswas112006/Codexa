const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    client: { type: String },
    status: {
      type: String,
      enum: ["Planning", "In Progress", "Review", "Completed"],
      default: "Planning",
    },
    dueDate: { type: Date },
    description: { type: String },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
