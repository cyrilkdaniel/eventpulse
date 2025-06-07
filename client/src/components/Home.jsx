import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  CircularProgress,
  Container,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import SearchPanel from "./SearchPanel";
import FiltersPanel from "./FiltersPanel";
import Error from "./Error";
import Recommendations from "./Recommendations";
import { BASE_API_PATH } from "../constants/endpoints";
import { fetchGenres } from "../services/genreService";
import api from "../services/api";
import { fetchEvents } from "../services/eventService";
import { fetchRecommendations } from "../services/userService";

// Background Image URL
const backgroundImageUrl =
  "https://images.unsplash.com/photo-1468234560893-89c00b6385c8?q=80&w=3872&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

// Styled MainSection with Background Image
const MainSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 2),
  textAlign: "center",
}));

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState("");
  const handleKeywordChange = (event) => {
    setKeyword(event.target.value);
  };

  const genres = useSelector((state) => state.genreReducer.genres);
  const [selectedGenre, setSelectedGenre] = useState("");
  const handleGenreSelection = (event) => {
    setSelectedGenre(event.target.value === "clear" ? "" : event.target.value);
  };

  const [date, setDate] = useState(null);
  const handleDateSelection = (value) => {
    setDate(value);
  };
  const isLoggedIn = useSelector((state) => state.authReducer.isLoggedIn);
  const user = useSelector((state) => state.userReducer.user);

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        await api.get(BASE_API_PATH);
        setStatus(true);
        setLoading(false);
      } catch (error) {
        setStatus(false);
        setLoading(false);
        setError(error);
      }
    };

    checkBackendConnection();
  }, []);

  useEffect(() => {
    if (genres.length === 0) fetchGenres(dispatch);
  }, [dispatch, genres]);

  useEffect(() => {
    if (isLoggedIn) fetchRecommendations(dispatch, user.interests);
  }, [isLoggedIn, user?.interests, dispatch]);

  const onSearch = () => {
    fetchEvents(dispatch, keyword, date, selectedGenre, genres);
    navigate("/events");
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    // <Box sx={{ width: "100%" }} textAlign="center">/<Box>
    status ? (
      <MainSection>
        <Stack spacing={2} alignItems="center">
          <Box>
            <Container>
              <Typography variant="h2" component="h1" gutterBottom>
                Find Your Next Big Event in Berlin
              </Typography>
              <Typography variant="h6" paragraph>
                Search and filter through a world of events tailored to your
                interests.
              </Typography>
            </Container>
          </Box>
          <Container>
            <SearchPanel
              keyword={keyword}
              handleKeywordChange={handleKeywordChange}
              onSearch={onSearch}
            />
          </Container>
          <Container>
            <FiltersPanel
              date={date}
              handleDateSelection={handleDateSelection}
              genres={genres}
              selectedGenre={selectedGenre}
              handleGenreSelection={handleGenreSelection}
            />
          </Container>
          {isLoggedIn && (
            <Container>
              <Recommendations />
            </Container>
          )}
        </Stack>
      </MainSection>
    ) : (
      <Error error={error} />
    )
  );
};

export default Home;
