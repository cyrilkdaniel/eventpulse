import { getGenres } from "../redux/slices/genreSlice.js";

// Fetch all genres
export const fetchGenres = async (dispatch) => {
  try {
    const response = dispatch(getGenres());
    // const response = await api.get(GENRES_PATH);
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Failed to fetch genres:", error);
    throw error; // Propagate the error for further handling
  }
};
