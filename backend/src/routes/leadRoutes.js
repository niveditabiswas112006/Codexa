const express = require("express");
const { createLead, getLeads, getLead, updateLead, deleteLead } = require("../controllers/leadController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect); // Protect all routes in this file

router.route("/")
  .post(createLead)
  .get(getLeads);

router.route("/:id")
  .get(getLead)
  .put(updateLead)
  .delete(deleteLead);

module.exports = router;
