import React from "react";
import { Box, Button, Container, Stack, TextField } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const SearchPanel = ({ keyword, handleKeywordChange, onSearch }) => {
  return (
    <Box>
      <Container>
        <Stack direction="row" spacing={2} justifyContent="center">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="What are you looking for?"
            value={keyword}
            onChange={handleKeywordChange}
            InputProps={{ style: { borderRadius: 8 } }}
            sx={{ maxWidth: 600, mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={onSearch}
            startIcon={<SearchOutlinedIcon />}
          >
            Search
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default SearchPanel;
