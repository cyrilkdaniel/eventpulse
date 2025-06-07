import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Box,
  CardActions,
  IconButton,
  Button,
} from "@mui/material";
import EventsListPagination from "./EventListPagination";
import { fetchEvents } from "../services/eventService";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import EventBusyIcon from "@mui/icons-material/EventBusy";

const EventsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const isLoggedIn = useSelector((state) => state.authReducer.isLoggedIn);
  const events = useSelector((state) => state.eventReducer.events);
  // const events = [];
  const pagination = useSelector((state) => state.eventReducer.pagination);
  const page = useSelector((state) => state.eventReducer.page);

  const handleFirst = () =>
    fetchEvents(
      dispatch,
      null,
      null,
      null,
      null,
      pagination.first.split("?")[1]
    );
  const handlePrev = () =>
    fetchEvents(
      dispatch,
      null,
      null,
      null,
      null,
      pagination.prev.split("?")[1]
    );
  const handleNext = () =>
    fetchEvents(
      dispatch,
      null,
      null,
      null,
      null,
      pagination.next.split("?")[1]
    );
  const handleLast = () => {
    console.log(pagination.last.split("?")[1]);
    fetchEvents(
      dispatch,
      null,
      null,
      null,
      null,
      pagination.last.split("?")[1]
    );
  };

  // const onFavoriteClick = (id) => {
  //   if (!isLoggedIn) {
  //     navigate("/login"); // Redirect to login if not logged in
  //     return;
  //   }
  // };

  return (
    <>
      {events.length === 0 ? (
        <Box textAlign="center" sx={{ mt: 5 }}>
          <EventBusyIcon
            sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
          />
          <Typography variant="h6" gutterBottom>
            No events found
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Please adjust your filters or check back later.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              navigate("/");
            }}
            sx={{ mt: 2 }}
          >
            Adjust Filters
          </Button>
        </Box>
      ) : (
        <Box sx={{ padding: 2 }}>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Explore Upcoming Events
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {page.totalElements}{" "}
              {page.totalElements === 1 ? "Event" : "Events"} Found
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {events.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <Link
                  to={`/events/${event.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card
                    sx={{
                      cursor: "pointer",
                      boxShadow: 3,
                      position: "relative", // Ensure that the icon can be positioned absolutely
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: 10,
                        "& .event-name": {
                          color: "primary.main",
                          fontWeight: "bold",
                        },
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={event.image}
                      alt={event.name}
                    />
                    <CardContent>
                      <Typography
                        variant="h6"
                        component="div"
                        className="event-name"
                        sx={{
                          transition: "color 0.3s ease, font-weight 0.3s ease",
                        }}
                      >
                        {event.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {event.venue.name}, {event.venue.city},{" "}
                        {event.venue.country}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Date: {event.startDate.date}
                      </Typography>
                    </CardContent>
                    {/* <CardActions
                      disableSpacing
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        // Adjust spacing based on your design
                      }}
                    >
                      <IconButton
                        aria-label="add to favorites"
                        onClick={(e) => {
                          e.preventDefault(); // Prevent the default action (navigation)
                          e.stopPropagation(); // Stop the event from propagating to the Card
                          // console.log(event);
                          onFavoriteClick(event.id); // Handle favorite click
                        }}
                      >
                        <FavoriteBorderIcon color="primary" />
                      </IconButton>
                    </CardActions> */}
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Displaying Page {page.number + 1} out of {page.totalPages}
            </Typography>
          </Box>
          <EventsListPagination
            onFirst={handleFirst}
            onPrev={handlePrev}
            onNext={handleNext}
            onLast={handleLast}
            hasNextPage={!!pagination.next}
            hasPrevPage={!!pagination.prev}
          />
        </Box>
      )}
    </>
  );
};

export default EventsList;
