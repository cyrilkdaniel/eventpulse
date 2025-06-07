import express from "express";
import controller from "../controllers/index.js";

const router = express.Router();

// Route to get all genres
router.get("/", controller.genreController.fetchGenresFromDb);

// Additional routes for POST, PUT, DELETE, etc. can be added here

export default router;
