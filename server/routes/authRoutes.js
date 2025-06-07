import express from "express";
import { body } from "express-validator";
import controller from "../controllers/index.js";

const router = express.Router();

// Register Route
router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/\d/)
      .withMessage("Password must contain at least one numeric digit")
      .matches(/[@$!%*?&#]/)
      .withMessage("Password must contain at least one special character"),
  ],
  controller.authController.registerUser
);

// Login Route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  controller.authController.loginUser
);

// Refresh Token Route
router.post("/refresh-token", controller.authController.refreshAccessToken);

// Logout Route
router.post("/logout", controller.authController.logoutUser);

export default router;
