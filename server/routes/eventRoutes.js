import express from "express";
import controller from "../controllers/index.js";

const router = express.Router();

// Route to get events
router.get("/", controller.eventController.fetchEventsViaApi);

// Additional routes for POST, PUT, DELETE, etc. can be added here

export default router;
