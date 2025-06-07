import express from "express";
import controller from "../controllers/index.js";
import middleware from "../middleware/index.js";

const router = express.Router();

// Create a booking
router.post(
  "/book",
  middleware.authMiddleware.authenticate,
  controller.reservationController.bookEvent
);

// Fetch a user's reservations
router.get(
  "/book",
  middleware.authMiddleware.authenticate,
  controller.reservationController.fetchReservations
);

// Fetch a user's reservations
router.delete(
  "/book/:eventId",
  middleware.authMiddleware.authenticate,
  controller.reservationController.cancelBooking
);

export default router;
