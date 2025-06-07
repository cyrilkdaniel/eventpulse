import { Reservation } from "../models/index.js";

const bookEvent = async (req, res) => {
  const { eventId, eventName, eventDate, venue } = req.body;
  const userId = req.user.id;

  try {
    // Check if the user already booked the event
    const existingBooking = await Reservation.findOne({ userId, eventId });
    if (existingBooking) {
      return res
        .status(400)
        .json({ message: "You have already booked this event." });
    }

    // Check for time conflicts
    const conflictingBooking = await Reservation.findOne({
      userId,
      eventDate: { $eq: new Date(eventDate) }, // Adjust conflict logic if needed
    });

    if (conflictingBooking) {
      return res.status(400).json({
        message: "You already have a booking at the same time.",
      });
    }

    // Create the booking
    const booking = new Reservation({
      userId,
      eventId,
      eventName,
      eventDate,
      venue,
    });

    await booking.save();

    res.status(201).json({ message: "Booking confirmed.", booking });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error creating booking.", error: error.message });
  }
};

const cancelBooking = async (req, res) => {
  const userId = req.user.id;
  const { eventId } = req.params;
  try {
    const reservation = await Reservation.findOneAndDelete({ eventId, userId });

    if (!reservation) {
      return res
        .status(404)
        .json({ message: "Reservation not found or already deleted." });
    }

    res.status(200).json({ message: "Reservation cancelled.", reservation });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error cancelling booking.", error: error.message });
  }
};

const fetchReservations = async (req, res) => {
  const userId = req.user.id;
  try {
    const reservations = await Reservation.find({ userId }).sort({
      eventDate: 1,
    });
    res.status(200).json({ reservations });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching bookings.", error: error.message });
  }
};

export default {
  bookEvent,
  cancelBooking,
  fetchReservations,
};
