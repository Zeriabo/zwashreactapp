import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, logOut } from "../slices/userSlice";
import { fetchStations } from "../slices/stationsSlice";
import { Link, useNavigate } from "react-router-dom";
import ServiceProviderSelect from "../components/ServiceProviderSelect";
import {
  ThemeProvider,
  createTheme,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#ff5722" },
  },
});

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userstate = useSelector(selectUser);
  const stations = useSelector((state) => state.station?.stations || []);
  const selectedServiceProviderId = useSelector(
    (state) => state.serviceProviders?.selectedServiceProviderId || null
  );

  const [serviceProviderId, setServiceProviderId] = useState(
    selectedServiceProviderId
  );

  useEffect(() => {
    if (selectedServiceProviderId !== null) {
      setServiceProviderId(selectedServiceProviderId);
      dispatch(fetchStations(selectedServiceProviderId));
    }
  }, [dispatch, selectedServiceProviderId]);

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/");
  };

  const handleEditStation = (stationId) => {
    navigate(`/station/${stationId}`);
  };

  if (userstate.loading) return <Typography>Loading...</Typography>;
  if (!userstate.user) {
    navigate("/");
    return null;
  }

  const { username } = userstate.user;

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
          p: 3,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4">Welcome, {username || "Guest"}!</Typography>
          <Button variant="outlined" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>

        {/* Service Provider Select */}
        <Box sx={{ mb: 4 }}>
          <ServiceProviderSelect />
        </Box>

        {/* Station List */}
        <Paper sx={{ p: 2, mb: 4 }} elevation={3}>
          <Typography variant="h5" gutterBottom>
            Stations
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {stations.length > 0 ? (
            <List>
              {stations.map((station) => (
                <ListItem
                  key={station.id}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    bgcolor: "#f5f5f5",
                  }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      color="primary"
                      onClick={() => handleEditStation(station.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={station.name}
                    secondary={station.address}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No stations available.</Typography>
          )}
        </Paper>

        {/* Create Station Button */}
        <Box textAlign="center">
          <Link to="/create-station" style={{ textDecoration: "none" }}>
            <Button variant="contained" color="primary" size="large">
              Create Station
            </Button>
          </Link>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
