const express = require("express");
const orderRouter = express.Router();

const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");

// Create Order
orderRouter.post("/", authMiddleware, orderController.placeOrder);

module.exports = orderRouter;
