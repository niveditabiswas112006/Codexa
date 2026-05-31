const Project = require("../models/Project");
const Task = require("../models/Task");

const createProject = async (req, res) => {
  try {
    const project = await Project.create({ 
      ...req.body, 
      owner: req.user.id, 
      assignedTo: req.body.assignedTo || req.user.id 
    });
    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("owner", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    // Enhance projects with task metrics dynamically
    const projectsWithTasks = await Promise.all(
      projects.map(async (project) => {
        const tasks = await Task.find({ project: project._id });
        const completedTasks = tasks.filter(t => t.status === "done").length;
        const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
        return {
          ...project.toObject(),
          tasksCount: tasks.length,
          completedTasks,
          progress
        };
      })
    );

    res.status(200).json({ success: true, projects: projectsWithTasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email")
      .populate("assignedTo", "name email");

    if (!project) return res.status(404).json({ message: "Project not found" });

    const tasks = await Task.find({ project: project._id });
    const completedTasks = tasks.filter(t => t.status === "done").length;
    const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

    res.status(200).json({ 
      success: true, 
      project: { 
        ...project.toObject(), 
        tasksCount: tasks.length, 
        completedTasks, 
        progress 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    // Cascading delete tasks belonging to this project
    await Task.deleteMany({ project: req.params.id });
    res.status(200).json({ success: true, message: "Project and associated tasks deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProject, getProjects, getProject, updateProject, deleteProject };
