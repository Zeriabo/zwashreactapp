import React, { useState } from "react";
import { Container, Typography, Button, Grid } from "@mui/material";
import SignIn from "../components/SignIn"; // Import the SignIn component
import Register from "../components/Register"; // Import the Register component

const Home = () => {
  const [showSignIn, setShowSignIn] = useState(true);

  const handleToggleForm = () => {
    setShowSignIn(!showSignIn);
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Service provider management
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          {showSignIn ? <SignIn /> : <Register />}
          <Button
            variant="text"
            color="primary"
            fullWidth
            onClick={handleToggleForm}
          >
            {showSignIn
              ? "Don't have an account? Register here"
              : "Already have an account? Sign in here"}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
