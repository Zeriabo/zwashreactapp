import React, { useState } from "react";
import {
  Typography,
  Button,
  TextField,
  Paper,
  CircularProgress, // Add CircularProgress for loading indicator
} from "@mui/material";
import { signIn, setError } from "../slices/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectLoading, selectError } from "../slices/userSlice"; // Add selectors for loading and error states

const SignIn = () => {
  const [signInData, setSignInData] = useState({ username: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectLoading); // Get loading state from Redux
  const error = useSelector(selectError); // Get error state from Redux

  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    setSignInData({ ...signInData, [name]: value });
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    // Handle sign-in logic here

    // Dispatch the sign-in action with credentials
    dispatch(signIn(signInData.username, signInData.password));

    // Check for errors and loading state
    if (!loading && !error) {
      // Sign-in successful, navigate to the dashboard
      navigate("/dashboard");
    }
  };

  return (
    <Paper elevation={3} style={{ padding: "20px" }}>
      <Typography variant="h5" align="center" gutterBottom>
        Sign In
      </Typography>
      <form onSubmit={handleSignInSubmit}>
        <TextField
          label="Username"
          name="username"
          fullWidth
          margin="normal"
          variant="outlined"
          value={signInData.username}
          onChange={handleSignInChange}
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          variant="outlined"
          value={signInData.password}
          onChange={handleSignInChange}
          required
        />
        {loading ? ( // Display loading indicator while signing in
          <CircularProgress color="primary" />
        ) : (
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sign In
          </Button>
        )}
        {error && (
          <Typography color="error" variant="body2">
            {error.message} {/* Display the error message */}
          </Typography>
        )}
      </form>
    </Paper>
  );
};

export default SignIn;
