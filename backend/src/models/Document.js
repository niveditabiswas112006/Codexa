const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["contract", "proposal", "invoice", "other"], default: "contract" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["draft", "pending_signature", "signed"], default: "draft" },
    recipients: [{ email: String, name: String, signedAt: Date }],
    fileUrl: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);
