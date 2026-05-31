const express = require("express");
const { createBooking, getBookings, updateBooking, deleteBooking } = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router.route("/")
  .post(createBooking)
  .get(getBookings);

router.route("/:id")
  .put(updateBooking)
  .delete(deleteBooking);

module.exports = router;
