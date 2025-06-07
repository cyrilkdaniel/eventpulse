import axios from "axios";
import { User } from "../models/index.js";
import { API_KEY, EVENTS_SEARCH_PATH } from "../config/config.js";

// Get Profile Info
const getProfileInfo = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const userObject = user.toObject();
    delete userObject.password;

    res.json({ user: userObject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  const { username, email, interests } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.username = username || user.username;
    user.email = email || user.email;
    user.interests = interests || user.interests;
    await user.save();

    const userObject = user.toObject();
    delete userObject.password;

    res.json({ message: "Profile updated successfully", user: userObject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Change Password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if current password is correct
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    if (
      newPassword.length < 8 ||
      !/[A-Z]/.test(newPassword) ||
      !/[a-z]/.test(newPassword) ||
      !/\d/.test(newPassword) ||
      !/[@$!%*?&#]/.test(newPassword)
    ) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
      });
    }

    // Update to new password
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const EVENTS_PATH = EVENTS_SEARCH_PATH;
    let recommendations = [];
    if (req.query.classificationId === "") return res.json({ recommendations });

    // Fetch events from the Ticketmaster API
    const response = await axios.get(`${EVENTS_PATH}`, {
      params: {
        apikey: API_KEY,
        locale: "de",
        city: "berlin",
        countryCode: "DE",
        size: 6,
        page: 0,
        ...req.query,
      },
    });

    // Extract key elements from the events array
    recommendations = !response.data._embedded
      ? []
      : response.data._embedded?.events?.map((event) => ({
          name: event.name,
          id: event.id,
          url: event.url,
          image:
            event.images.find((img) => img.ratio === "16_9")?.url ||
            event.images[0].url,
          startDate: {
            date: event.dates.start.localDate,
            dateTime:
              event.dates.start.dateTime ||
              new Date(event.dates.start.localDate).toISOString(),
          },
          promoter:
            event.promoters?.map((promoter) => promoter.name).toString() ||
            event.promoter?.name ||
            "No information regarding promoter",
          venue: {
            name: event._embedded.venues[0]?.name,
            address: event._embedded.venues[0]?.address?.line1,
            postalCode: event._embedded.venues[0]?.postalCode,
            city: event._embedded.venues[0]?.city?.name,
            country: event._embedded.venues[0]?.country?.name,
          },
          genres: event.classifications.map(
            (classification) =>
              classification.segment.id || classification.type.id
          ),
        }));

    const result = {
      recommendations,
    };
    console.log({ message: "Recommendations found successfully" });
    return res.json(result);
  } catch (error) {
    if (error.response?.status === 429) {
      // Rate limit exceeded
      const retryAfter = error.response.headers["retry-after"] || 60; // Default to 60 seconds if not provided
      return res.status(429).json({
        message:
          "Rate limit exceeded for fetching recommendations. Please try again later.",
        retryAfter: parseInt(retryAfter),
        recommendations: [], // Return empty recommendations to prevent frontend errors
      });
    }

    // For other errors, return a generic error response
    return res.status(error.response?.status || 500).json({
      message: "Failed to fetch recommendations",
      recommendations: [], // Return empty recommendations to prevent frontend errors
    });
  }
};

export default {
  getProfileInfo,
  updateProfile,
  changePassword,
  getRecommendations,
};
