const Workflow = require("../models/Workflow");

const createWorkflow = async (req, res) => {
  try {
    const workflow = await Workflow.create(req.body);
    res.status(201).json({ success: true, workflow });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWorkflows = async (req, res) => {
  try {
    const workflows = await Workflow.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, workflows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateWorkflow = async (req, res) => {
  try {
    const workflow = await Workflow.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!workflow) return res.status(404).json({ message: "Workflow not found" });
    res.status(200).json({ success: true, workflow });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteWorkflow = async (req, res) => {
  try {
    const workflow = await Workflow.findByIdAndDelete(req.params.id);
    if (!workflow) return res.status(404).json({ message: "Workflow not found" });
    res.status(200).json({ success: true, message: "Workflow deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createWorkflow, getWorkflows, updateWorkflow, deleteWorkflow };
