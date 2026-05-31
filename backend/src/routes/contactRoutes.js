const express = require("express");
const { createContact, getContacts, getContact, updateContact, deleteContact } = require("../controllers/contactController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect); // Protect all routes in this file

router.route("/")
  .post(createContact)
  .get(getContacts);

router.route("/:id")
  .get(getContact)
  .put(updateContact)
  .delete(deleteContact);

module.exports = router;
