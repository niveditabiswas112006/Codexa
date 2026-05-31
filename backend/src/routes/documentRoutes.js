const express = require("express");
const { createDocument, getDocuments, updateDocument, deleteDocument } = require("../controllers/documentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router.route("/")
  .post(createDocument)
  .get(getDocuments);

router.route("/:id")
  .put(updateDocument)
  .delete(deleteDocument);

module.exports = router;
