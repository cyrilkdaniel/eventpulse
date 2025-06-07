import React from "react";
import { Button, Box, ButtonGroup } from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const EventsListPagination = ({
  onFirst,
  onPrev,
  onNext,
  onLast,
  hasNextPage,
  hasPrevPage,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        marginTop: 4,
        gap: 2,
        padding: 2,
        // backgroundColor: '#f5f5f5',
        borderRadius: "8px",
      }}
    >
      <ButtonGroup variant="outlined">
        <Button
          onClick={onFirst}
          disabled={!hasPrevPage}
          startIcon={<FirstPageIcon />}
        >
          First
        </Button>
        <Button
          onClick={onPrev}
          disabled={!hasPrevPage}
          startIcon={<NavigateBeforeIcon />}
        >
          Prev
        </Button>
        <Button
          onClick={onNext}
          disabled={!hasNextPage}
          endIcon={<NavigateNextIcon />}
        >
          Next
        </Button>
        <Button
          onClick={onLast}
          disabled={!hasNextPage}
          endIcon={<LastPageIcon />}
        >
          Last
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default EventsListPagination;
