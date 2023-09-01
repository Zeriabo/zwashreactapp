import React, { useState } from "react";
import { Typography, Button, TextField, Paper } from "@mui/material";

const Register = () => {
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
    console.log("Register data:", registerData);
  };

  return (
    <Paper elevation={3} style={{ padding: "20px" }}>
      <Typography variant="h5" align="center" gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleRegisterSubmit}>
        <TextField
          label="Username"
          name="username"
          fullWidth
          margin="normal"
          variant="outlined"
          value={registerData.username}
          onChange={handleRegisterChange}
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          variant="outlined"
          value={registerData.password}
          onChange={handleRegisterChange}
          required
        />
        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          fullWidth
          margin="normal"
          variant="outlined"
          value={registerData.confirmPassword}
          onChange={handleRegisterChange}
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Register
        </Button>
      </form>
    </Paper>
  );
};

export default Register;
