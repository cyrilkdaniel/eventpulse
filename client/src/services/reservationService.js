import { BOOKING_ENDPOINT } from "../constants/endpoints";
import { getReservations } from "../redux/slices/reservationSlice";
import api from "./api";

export const bookEvent = async (eventId, eventName, eventDate, venue) => {
  try {
    const response = await api.post(BOOKING_ENDPOINT, {
      eventId,
      eventName,
      eventDate,
      venue,
    });
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Failed to book event:", error);
    throw error; // Propagate the error for further handling
  }
};

// Fetch user's reservations
export const fetchReservations = async (dispatch) => {
  try {
    const response = dispatch(getReservations());
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Failed to fetch events:", error);
    throw error; // Propagate the error for further handling
  }
};

export const cancelBooking = async (eventId) => {
  try {
    const response = await api.delete(`${BOOKING_ENDPOINT}/${eventId}`, {});
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Failed to book event:", error);
    throw error; // Propagate the error for further handling
  }
};
