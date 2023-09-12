import React, { useState } from "react";
import { Button, Grid } from "@mui/material";
import SignIn from "../components/SignIn";
import Register from "../components/Register";
import Layout from "../components/Layout"; // Import the Layout component

const Home = () => {
  const [showSignIn, setShowSignIn] = useState(true);

  const handleToggleForm = () => {
    setShowSignIn(!showSignIn);
  };

  return (
    <Layout>
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
    </Layout>
  );
};

export default Home;
