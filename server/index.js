import express from "express";
import cors from "cors";
import { PORT } from "./config/config.js";
import { connectDB, db } from "./config/database.js"; // Import the db object
import routes from "./routes/index.js"; // Import the centralized routes

const app = express();

// Use CORS middleware
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Middleware for parsing JSON requests
app.use(express.json());

// Use centralized routes
app.use("/", routes);

// Only start the server if this file is run directly (not imported)
if (process.env.NODE_ENV !== "test") {
  // Connect to the database
  connectDB().then(() => {
    app.listen(PORT || 5000, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
}

export default app;
