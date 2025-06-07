import React, { useState } from "react";
import { useSelector } from "react-redux";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {
  Typography,
  Container,
  Box,
  List,
  ListItem,
  ListItemText,
  Grid,
} from "@mui/material";

const ReservationsCalendar = () => {
  const reservations = useSelector(
    (state) => state.reservationReducer.reservations
  );

  // Filter non-expired reservations
  const nonExpiredReservations = reservations.filter((reservation) =>
    dayjs().isBefore(dayjs(reservation.eventDate))
  );

  // Format reservation dates to "YYYY-MM-DD"
  const reservationDates = nonExpiredReservations.map((reservation) =>
    dayjs(reservation.eventDate).format("YYYY-MM-DD")
  );

  // State for the selected date
  const [selectedDate, setSelectedDate] = useState(null);

  // Filter reservations for the selected date
  const filteredReservations = nonExpiredReservations.filter(
    (reservation) =>
      dayjs(reservation.eventDate).format("YYYY-MM-DD") === selectedDate
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container
        sx={{
          padding: 4,
          minHeight: "100vh",
          backgroundColor: "background.default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            backgroundColor: "background.paper",
            boxShadow: 3,
            borderRadius: 4,
            padding: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              marginBottom: 4,
              fontWeight: 600,
              color: "primary.main",
            }}
          >
            Reservation Calendar
          </Typography>

          <Grid container spacing={4}>
            {/* Calendar Section */}
            <Grid item xs={12} md={6}>
              <DateCalendar
                value={selectedDate ? dayjs(selectedDate) : null}
                onChange={(newValue) =>
                  setSelectedDate(newValue?.format("YYYY-MM-DD") || null)
                }
                minDate={dayjs()}
                renderDay={(day, _value, DayComponentProps) => {
                  const formattedDay = day.format("YYYY-MM-DD");
                  const isReserved = reservationDates.includes(formattedDay);

                  return (
                    <div>
                      <DayComponentProps.day
                        sx={{
                          ...(isReserved && {
                            backgroundColor: "primary.light",
                            borderRadius: "50%",
                            color: "white",
                            "&:hover": { backgroundColor: "primary.main" },
                          }),
                        }}
                      />
                    </div>
                  );
                }}
              />
            </Grid>

            {/* Reserved Events Section */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  backgroundColor: "background.default",
                  padding: 2,
                  borderRadius: 4,
                  boxShadow: 1,
                  height: "100%",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: "center",
                    marginBottom: 2,
                    color: "secondary.main",
                  }}
                >
                  {selectedDate
                    ? `Reservations for ${dayjs(selectedDate).format(
                        "DD/MM/YYYY"
                      )}`
                    : "Select a Date to View Reservations"}
                </Typography>

                {filteredReservations.length > 0 ? (
                  <List>
                    {filteredReservations.map((reservation) => (
                      <ListItem key={reservation.id} sx={{ padding: 1 }}>
                        <ListItemText
                          primary={reservation.eventName}
                          secondary={`Time: ${dayjs(
                            reservation.eventDate
                          ).format("HH:mm")}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  selectedDate && (
                    <Typography
                      variant="body1"
                      sx={{
                        textAlign: "center",
                        color: "text.secondary",
                        marginTop: 2,
                      }}
                    >
                      No reservations found for the selected date.
                    </Typography>
                  )
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default ReservationsCalendar;
