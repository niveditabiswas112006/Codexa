const Deal = require("../models/Deal");

const createDeal = async (req, res) => {
  try {
    const deal = await Deal.create({ ...req.body, assignedTo: req.user.id });
    res.status(201).json({ success: true, deal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDeals = async (req, res) => {
  try {
    const deals = await Deal.find().populate("lead", "name email company").populate("assignedTo", "name email").sort({ createdAt: -1 });
    res.status(200).json({ success: true, deals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDeal = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id).populate("lead").populate("assignedTo", "name email");
    if (!deal) return res.status(404).json({ message: "Deal not found" });
    res.status(200).json({ success: true, deal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDeal = async (req, res) => {
  try {
    const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!deal) return res.status(404).json({ message: "Deal not found" });
    res.status(200).json({ success: true, deal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDeal = async (req, res) => {
  try {
    const deal = await Deal.findByIdAndDelete(req.params.id);
    if (!deal) return res.status(404).json({ message: "Deal not found" });
    res.status(200).json({ success: true, message: "Deal deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createDeal, getDeals, getDeal, updateDeal, deleteDeal };
