import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Divider,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventIcon from "@mui/icons-material/Event";
import LabelIcon from "@mui/icons-material/Label";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
  bookEvent,
  cancelBooking,
  fetchReservations,
} from "../services/reservationService";

const EventDetail = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  let event = useSelector((state) =>
    state.eventReducer.events.find((e) => e.id === id)
  );
  const recommendation = useSelector((state) =>
    state.userReducer.recommendations.find((r) => r.id === id)
  );

  if (!event) event = recommendation;

  const genres = useSelector((state) => state.genreReducer.genres);
  const genresObject = genres.reduce((acc, genre) => {
    acc[genre._id] = genre.name;
    return acc;
  }, {});

  const isLoggedIn = useSelector((state) => state.authReducer.isLoggedIn);
  const reservations = useSelector(
    (state) => state.reservationReducer.reservations
  );

  const isBooked = reservations.some(
    (reservation) => reservation.eventId === id
  );
  // const isCurrentEventBooked
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  // useEffect(() => {
  //   const getReservations = async () => {await fetchReservations(dispatch)};
  //   getReservations();
  // }, [isBooked])

  if (!event) {
    return <Typography>Event not found</Typography>;
  }

  const address = `${event.venue.address}, ${event.venue.city}, ${event.venue.postalCode}, ${event.venue.country}`;
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    address
  )}`;

  const genreNames = event.genres
    .map((genre) => (genresObject[genre] ? genresObject[genre] : undefined))
    .filter((genre) => genre !== undefined)
    .toString();

  const bookEventHandler = async () => {
    try {
      if (!isLoggedIn) {
        setModalTitle("Booking Failed");
        setModalMessage("You need to login to book an event");
        setModalOpen(true);
        return;
      }

      if (isBooked) {
        // Cancel booking
        await cancelBooking(event.id);
        setModalTitle("Booking Cancelled");
        setModalMessage("Your booking has been successfully cancelled.");
      } else {
        await bookEvent(
          event.id,
          event.name,
          event.startDate.dateTime,
          event.venue
        );
        setModalTitle("Booking Successful!");
        setModalMessage("Your booking was successful. Enjoy the event!");
      }
      await fetchReservations(dispatch);
    } catch (error) {
      setModalTitle("Booking Failed");
      if (error.response.status === 401)
        setModalMessage("You need to login to book an event");
      else
        setModalMessage(
          error.response.data.message || "An unexpected error occurred."
        );
    } finally {
      setModalOpen(true);
    }
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  return (
    <Box
      sx={{
        padding: 3,
        minHeight: "100vh",
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "row",
          boxShadow: 3,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <CardMedia
          component="img"
          sx={{
            width: "50%",
            filter: "brightness(85%)",
            transition: "filter 0.3s ease",
            "&:hover": {
              filter: "brightness(100%)",
            },
          }}
          image={event.image}
          alt={event.name}
        />
        <CardContent sx={{ width: "50%", padding: 4 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: "bold",
              textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            {event.name}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
            <LabelIcon color="primary" />
            <Typography variant="body1">{genreNames}</Typography>
          </Stack>

          <Divider sx={{ my: 3, borderStyle: "dashed" }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LocationOnIcon color="primary" />
                  <Typography variant="h6">{event.venue.name}</Typography>
                </Stack>
                <Typography variant="body1" sx={{ pl: "32px" }}>
                  {event.venue.address}, {event.venue.city},{" "}
                  {event.venue.postalCode}, {event.venue.country}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <EventIcon color="primary" />
                <Typography variant="h6">{event.startDate.date}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AccessTimeIcon color="primary" />
                <Typography variant="h6">
                  {event.startDate.dateTime
                    ? new Date(event.startDate.dateTime).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : "Unavailable"}
                </Typography>
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3, borderStyle: "dashed" }} />

          <Typography variant="body1" sx={{ mt: 2 }}>
            Promoter: {event.promoter}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
            <Button
              variant="contained"
              color={isBooked ? "secondary" : "primary"}
              // href={event.url}
              onClick={bookEventHandler}
              // target="_blank"
              sx={{
                boxShadow: 2,
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              {isBooked ? "Cancel Booking" : "Book"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              href={googleMapsUrl}
              target="_blank"
              sx={{
                boxShadow: 2,
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              Get Directions
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={modalOpen} onClose={handleClose}>
        <DialogTitle>{modalTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{modalMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventDetail;
