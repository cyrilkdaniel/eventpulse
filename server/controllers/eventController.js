import axios from "axios";
import { Genre } from "../models/index.js";
import { API_KEY, EVENTS_SEARCH_PATH } from "../config/config.js";

// Fetch events dynamically via Ticketmaster API
const fetchEventsViaApi = async (req, res) => {
  try {
    // console.log(req.query);

    let EVENTS_PATH = EVENTS_SEARCH_PATH;

    if (req.query.queryParams) {
      EVENTS_PATH = EVENTS_PATH + `?${req.query.queryParams}`;
    }

    // Fetch events from the Ticketmaster API
    const response = await axios.get(`${EVENTS_PATH}`, {
      params: req.query.queryParams
        ? {
            apikey: API_KEY,
          }
        : {
            apikey: API_KEY,
            locale: "de",
            city: "berlin",
            countryCode: "DE",
            size: 9,
            ...req.query,
          },
    });

    // console.log(response.data._links);

    const { _links, page: paginationPage } = response.data;

    // Extract key elements from the events array
    const events = !response.data._embedded
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

    // Build the pagination links for the frontend
    const pagination = {
      first: _links.first ? _links.first.href : null,
      prev: _links.prev ? _links.prev.href : null,
      next: _links.next ? _links.next.href : null,
      last: _links.last ? _links.last.href : null,
    };

    const result = {
      events,
      pagination,
      page: paginationPage,
    };

    console.log({ message: "Events found successfully" });
    return res.json(result);
  } catch (error) {
    console.error("Error fetching events:", error);
    throw new Error("Failed to fetch events");
  }
};

export default { fetchEventsViaApi };
