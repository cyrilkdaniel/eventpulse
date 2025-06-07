import express from "express";
import controller from "../controllers/index.js";
import middleware from "../middleware/index.js";

const router = express.Router();

// Get Recommendations Route
router.get(
  "/profile",
  middleware.authMiddleware.authenticate,
  controller.userController.getProfileInfo
);

// Profile Update Route
router.put(
  "/profile",
  middleware.authMiddleware.authenticate,
  controller.userController.updateProfile
);

// Change Password Route
router.put(
  "/profile/change-password",
  middleware.authMiddleware.authenticate,
  controller.userController.changePassword
);

// Get Recommendations Route
router.get(
  "/profile/recommendations",
  middleware.authMiddleware.authenticate,
  controller.userController.getRecommendations
);

export default router;
