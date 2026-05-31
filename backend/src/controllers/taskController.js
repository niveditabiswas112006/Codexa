const Task = require("../models/Task");

const createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      owner: req.user.id,
      assignedTo: req.body.assignedTo || req.user.id
    });
    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const query = {};
    if (req.query.project) query.project = req.query.project;

    const tasks = await Task.find(query)
      .populate("project", "title")
      .populate("owner", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("project", "title")
      .populate("owner", "name")
      .populate("assignedTo", "name");

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTask, getTasks, getTask, updateTask, deleteTask };
