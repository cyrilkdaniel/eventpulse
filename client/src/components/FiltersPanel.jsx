import React from "react";
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const FiltersPanel = ({
  date,
  handleDateSelection,
  genres,
  selectedGenre,
  handleGenreSelection,
}) => {
  return (
    <Box
      sx={{
        padding: "16px", // Adjust padding if needed
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Direct shadow value
      }}
    >
      <Container>
        <Stack>
          <Typography variant="h5" gutterBottom>
            Filters
          </Typography>
          {/* <FormControl fullWidth margin="normal">
            <InputLabel id="location-label">Location</InputLabel>
            <Select
              labelId="location-label"
              id="location"
              defaultValue=""
              label="Location"
            >
              <MenuItem value="">All Locations</MenuItem>
              <MenuItem value="new-york">New York</MenuItem>
              <MenuItem value="san-francisco">San Francisco</MenuItem>
            </Select>
          </FormControl> */}

          <FormControl fullWidth margin="normal">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                minDate={dayjs(new Date())}
                value={date}
                onChange={(value) => handleDateSelection(value)}
              />
            </LocalizationProvider>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="genre-label">Genre</InputLabel>
            <Select
              labelId="genre-label"
              id="genre"
              defaultValue=""
              label="Genre"
              value={selectedGenre}
              onChange={(event) => handleGenreSelection(event)}
            >
              <MenuItem value="clear">Clear selection</MenuItem>
              {genres.map((genre) => (
                <MenuItem key={genre._id} value={genre._id}>
                  {genre.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Container>
    </Box>
  );
};

export default FiltersPanel;
