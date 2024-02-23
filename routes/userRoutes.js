const express = require("express");
const { body } = require("express-validator");

const userRouter = express.Router();
const userController = require("../controllers/userController");

// Routing for Registering User

userRouter.post(
  "/register",
  [
    body("email")
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("Please provide a valid email."),
    body("password")
      .notEmpty()
      .withMessage("Password is required.")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters."),
  ],
  userController.registerUser
);

userRouter.post(
  "/login",
  [
    body("email")
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("Please provide a valid email."),
    body("password")
      .notEmpty()
      .withMessage("Password is required.")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters."),
  ],
  userController.loginUser
);

module.exports = userRouter;
