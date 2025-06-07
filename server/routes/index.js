import express from "express";
import eventRoutes from "./eventRoutes.js"; // Import your event routes
import genreRoutes from "./genreRoutes.js"; // Import your genre routes
import authRoutes from "./authRoutes.js"; // Import your auth routes
import userRoutes from "./userRoutes.js"; // Import your user routes
import reservationRoutes from "./reservationRoutes.js"; // Import your user routes
import controller from "../controllers/index.js";
import {
  GENRES_ENDPOINT,
  EVENT_ENDPOINT,
  AUTH_ENDPOINT,
  USER_ENDPOINT,
  RESERVATION_ENDPOINT,
} from "../common/index.js";

const router = express.Router();

// Home route
router.get("/", async (req, res) => {
  try {
    // Call the fetchandStoreGenresViaApi function
    await controller.genreController.fetchandStoreGenresViaApi(req, res);

    // After fetching genres, return the welcome message
    return res.status(200).send("Welcome to EventPulse");
  } catch (error) {
    return res.status(500).send("An error occurred while loading the homepage");
  }
});

// Register your routes here
router.use(GENRES_ENDPOINT, genreRoutes);
router.use(EVENT_ENDPOINT, eventRoutes);
router.use(AUTH_ENDPOINT, authRoutes);
router.use(USER_ENDPOINT, userRoutes);
router.use(RESERVATION_ENDPOINT, reservationRoutes);

export default router;
