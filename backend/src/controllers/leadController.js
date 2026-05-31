const Lead = require("../models/Lead");

// Create Lead
const createLead = async (req, res) => {
  try {
    const lead = await Lead.create({ ...req.body, assignedTo: req.user.id });
    res.status(201).json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Leads
const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().populate("assignedTo", "name email").sort({ createdAt: -1 });
    res.status(200).json({ success: true, leads });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Lead
const getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate("assignedTo", "name email");
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.status(200).json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Lead
const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.status(200).json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Lead
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.status(200).json({ success: true, message: "Lead deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createLead, getLeads, getLead, updateLead, deleteLead };
