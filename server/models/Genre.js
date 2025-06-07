import mongoose from "mongoose";
import { db } from "../config/database.js"; // Import the db object

const genreSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const Genre = db.model("Genre", genreSchema);

export default Genre;
