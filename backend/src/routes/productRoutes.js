const express = require("express");
const { createProduct, getProducts, updateProduct, deleteProduct } = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router.route("/")
  .post(createProduct)
  .get(getProducts);

router.route("/:id")
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
