const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    category: { type: String },
    warehouse: { type: String, default: "Main Warehouse" },
    stock: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    supplier: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
