import React, { useState } from "react";
import {
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
  Link,
} from "@mui/material";
import { registerUser } from "../slices/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
    phone: "",
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
    console.log("Register data:", user);
    dispatch(registerUser(user));
    const registrationSuccessful = true;
    if (registrationSuccessful) {
      navigate.push("/signin");
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" height="100vh">
      <Paper elevation={3} style={{ padding: "16px", width: "300px" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleRegisterSubmit}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={user.username}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            value={user.password}
            onChange={handleChange}
            type="password"
            variant="outlined"
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={user.email}
            onChange={handleChange}
            type="email"
            variant="outlined"
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "16px" }}
          >
            Register
          </Button>
        </form>
        <Typography
          variant="body2"
          align="center"
          style={{ marginTop: "16px" }}
        >
          Already have an account? <Link to="/signin">Sign In</Link>
        </Typography>
      </Paper>
    </Grid>
  );
};

export default Register;
