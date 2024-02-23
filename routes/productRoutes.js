const express = require("express");
const productRouter = express.Router();

const productController = require("../controllers/productController");
const authMiddleware = require("../middlewares/authMiddleware");

productRouter.post("/insert", authMiddleware, productController.insertProduct);

productRouter.get("/categories", productController.getCategories);

productRouter.get(
  "/category/:categoryName",
  productController.getProductsByCategory
);

productRouter.get("/:productId", productController.getProductById);

module.exports = productRouter;
