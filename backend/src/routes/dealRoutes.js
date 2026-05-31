const express = require("express");
const { createDeal, getDeals, getDeal, updateDeal, deleteDeal } = require("../controllers/dealController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect); // Protect all routes in this file

router.route("/")
  .post(createDeal)
  .get(getDeals);

router.route("/:id")
  .get(getDeal)
  .put(updateDeal)
  .delete(deleteDeal);

module.exports = router;
