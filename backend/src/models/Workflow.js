const mongoose = require("mongoose");

const workflowSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["active", "draft", "paused"], default: "draft" },
    trigger: { type: String, default: "lead_created" },
    nodes: [
      {
        id: { type: String },
        type: { type: String },
        label: { type: String }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workflow", workflowSchema);
