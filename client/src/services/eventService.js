import { getEvents } from "../redux/slices/eventSlice.js";

// Fetch events
export const fetchEvents = async (
  dispatch,
  _keyword,
  date,
  genre,
  genreList,
  queryParams
) => {
  try {
    let response;
    if (queryParams) {
      response = dispatch(
        getEvents({
          keyword: null,
          startDateTime: null,
          classificationId: null,
          queryParams,
        })
      );
      return response.data;
    }
    const keyword = _keyword === "" || _keyword == null ? null : _keyword;
    const startDateTime =
      date === null ? null : date.format("YYYY-MM-DDTHH:mm:ss[Z]");
    const classificationId =
      genre === "" || genre == null
        ? genreList.map((genre) => genre._id).toString()
        : genre;
    response = dispatch(
      getEvents({
        keyword,
        startDateTime,
        classificationId,
        // queryParams,
      })
    );
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Failed to fetch events:", error);
    throw error; // Propagate the error for further handling
  }
};
