const express = require("express");
const { createProject, getProjects, getProject, updateProject, deleteProject } = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect); // Protect all routes

router.route("/")
  .post(createProject)
  .get(getProjects);

router.route("/:id")
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

module.exports = router;
