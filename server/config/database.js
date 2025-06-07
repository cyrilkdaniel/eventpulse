import mongoose from "mongoose";
import { mongoDbUrl } from "./config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(mongoDbUrl, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};

const db = mongoose.connection.useDb("EventPulse");

export { connectDB, db };
