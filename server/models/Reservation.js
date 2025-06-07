import mongoose from "mongoose";
import { db } from "../config/database.js"; // Import the db object

const reservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventId: { type: String, required: true },
  eventName: { type: String, required: true },
  eventDate: { type: Date, required: true },
  venue: {
    name: String,
    address: String,
    postalCode: String,
    city: String,
    country: String,
  },
  status: {
    type: String,
    default: "confirmed",
    enum: ["confirmed", "cancelled"],
  },
  createdAt: { type: Date, default: Date.now },
});

const Reservation = db.model("Reservation", reservationSchema);

export default Reservation;
