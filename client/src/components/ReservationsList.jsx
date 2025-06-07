import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  Card,
  Box,
  Button,
  Stack,
  Chip,
  Container,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import {
  cancelBooking,
  fetchReservations,
} from "../services/reservationService";

const ReservationsList = () => {
  const dispatch = useDispatch();
  const reservations = useSelector(
    (state) => state.reservationReducer.reservations
  );
  const theme = useTheme();

  const isExpired = (dateTime) => dayjs().isAfter(dayjs(dateTime));

  const onCancelBooking = async (eventId) => {
    await cancelBooking(eventId);
    await fetchReservations(dispatch);
  };

  return (
    <Container
      sx={{
        padding: theme.spacing(4),
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: theme.palette.background.default,
        borderRadius: 2,
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          textAlign: "center",
          marginBottom: 4,
          padding: 2,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
        >
          My Reservations
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Review your upcoming and past reservations below
        </Typography>
      </Box>

      {/* Reservations List */}
      {reservations.length === 0 ? (
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ textAlign: "center", marginTop: 4 }}
        >
          No reservations found. Start booking your next event!
        </Typography>
      ) : (
        reservations.map((reservation) => {
          const expired = isExpired(reservation.eventDate);

          return (
            <Card
              key={reservation.eventId}
              sx={{
                marginBottom: 3,
                position: "relative",
                padding: 3,
                backgroundColor: theme.palette.background.paper,
                borderRadius: theme.shape.borderRadius,
                boxShadow: theme.shadows[4],
              }}
            >
              {/* Expired Chip in Top-Right */}
              {expired && (
                <Chip
                  label="Expired"
                  color="error"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    fontWeight: "bold",
                    zIndex: 1,
                  }}
                />
              )}

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      marginBottom: 1,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {reservation.eventName}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {dayjs(reservation.eventDate).format("DD/MM/YYYY HH:mm")}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ marginTop: 1, color: theme.palette.text.secondary }}
                  >
                    {reservation.venue.address +
                      ", " +
                      reservation.venue.city +
                      ", " +
                      reservation.venue.postalCode +
                      ", " +
                      reservation.venue.country || "Location not specified"}
                  </Typography>
                </Box>

                {/* Cancel Booking Button in Bottom-Right */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    right: 16,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={expired}
                    onClick={() => onCancelBooking(reservation.eventId)}
                  >
                    Cancel Booking
                  </Button>
                </Box>
              </Stack>
            </Card>
          );
        })
      )}
    </Container>
  );
};

export default ReservationsList;
