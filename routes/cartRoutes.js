const express = require("express");
const cartRouter = express.Router();
const cartController = require("../controllers/cartController");
const { body, param } = require("express-validator");
const authMiddleWare = require("../middlewares/authMiddleware");

// Add Prduct to Cart
cartRouter.post(
  "/add",
  [body("product").notEmpty().withMessage("Product ID is required.")],
  authMiddleWare,
  cartController.addToCart
);

// View Cart
cartRouter.get("/view", authMiddleWare, cartController.viewCart);

// Decrement Cart
cartRouter.patch(
  "/decrement/:productId",
  authMiddleWare,
  cartController.decrementQuantity
);

// Delete Cart
cartRouter.delete("/remove/:productId", [
  param("productId").notEmpty().withMessage("Product ID is required."),
  authMiddleWare,
  cartController.removeProductFromCart,
]);

module.exports = cartRouter;
