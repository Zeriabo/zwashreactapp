import React, { useState } from "react";
import { Typography, Button, TextField, Paper } from "@mui/material";
import { signIn } from "../slices/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const SignIn = () => {
  const [signInData, setSignInData] = useState({ username: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    setSignInData({ ...signInData, [name]: value });
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    // Handle sign-in logic here
    console.log("Sign-in data:", signInData);
    dispatch(signIn(signInData.username, signInData.password));
    const signInSuccessful = true;
    if (signInSuccessful) {
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
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Sign In
        </Button>
      </form>
    </Paper>
  );
};

export default SignIn;
