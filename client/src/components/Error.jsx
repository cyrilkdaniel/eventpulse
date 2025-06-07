import { Box, Container, Typography } from "@mui/material";
import React from "react";

const Error = ({ error }) => {
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        textAlign="center"
      >
        <Typography variant="h4" gutterBottom color="error">
          Connection Error
        </Typography>
        <Typography variant="body1" paragraph>
          We were unable to connect to the backend. Please check your internet
          connection or try again later. <br />
          {error ? error.message : null}
        </Typography>
      </Box>
    </Container>
  );
};

export default Error;
