import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const Recommendations = () => {
  const recommendations = useSelector(
    (state) => state.userReducer.recommendations
  );

  return (
    <Box sx={{ padding: 2, mt: 4 }}>
      {recommendations.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            We couldn't find any recommendations for you.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Set your interests to see personalized recommendations.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/profile" // Replace with the appropriate route for setting interests
          >
            Set Your Interests
          </Button>
        </Box>
      ) : (
        <>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Recommended for You
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Events you may love based on your interests
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {recommendations.slice(0, 6).map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <Link
                  to={`/events/${event.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card
                    sx={{
                      cursor: "pointer",
                      boxShadow: 3,
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
                    <IconButton
                      aria-label="add to favorites"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Handle favorite click
                      }}
                    >
                      <FavoriteBorderIcon color="primary" />
                    </IconButton>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Recommendations;
