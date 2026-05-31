const express = require("express");
const { createWorkflow, getWorkflows, updateWorkflow, deleteWorkflow } = require("../controllers/workflowController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router.route("/")
  .post(createWorkflow)
  .get(getWorkflows);

router.route("/:id")
  .put(updateWorkflow)
  .delete(deleteWorkflow);

module.exports = router;
