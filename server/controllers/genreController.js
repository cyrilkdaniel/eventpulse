import axios from "axios";
import { Genre } from "../models/index.js";
import { API_KEY, GENRES_PATH } from "../config/config.js";

// Fetch and store genres dynamically via Ticketmaster API
const fetchandStoreGenresViaApi = async (req, res) => {
  try {
    // Fetch genres from the Ticketmaster API
    const response = await axios.get(GENRES_PATH, {
      params: { apikey: API_KEY, locale: "*", size: 4 },
    });

    const { classifications } = response.data._embedded;
    const genres = classifications
      .map((classification) => {
        return {
          id: classification.segment?.id || classification.type?.id,
          name: classification.segment?.name || classification.type?.name,
        };
      })
      .filter((classification) => classification.name != "Undefined");

    // Store each genre in the MongoDB collection
    for (const genre of genres) {
      await Genre.updateOne(
        { _id: genre.id },
        { name: genre.name },
        { upsert: true }
      );
    }

    console.log({ message: "Genres updated successfully" });
  } catch (error) {
    console.error("Error fetching genres:", error);
    throw new Error("Failed to fetch genres");
  }
};

const fetchGenresFromDb = async (req, res) => {
  try {
    const genres = await Genre.find(); // Fetch genres from the database
    res.json(genres);
  } catch (error) {
    res.status(500).json({ message: "Error fetching genres", error });
  }
};

export default { fetchandStoreGenresViaApi, fetchGenresFromDb };
