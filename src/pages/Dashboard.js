import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, logOut } from "../slices/userSlice";
import { fetchStations } from "../slices/stationsSlice";
import { Link, useNavigate } from "react-router-dom";
import ServiceProviderSelect from "../components/ServiceProviderSelect";
import "./Dashboard.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const theme = createTheme({
  palette: {
    primary: { main: "#007bff" },
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

  // Sync serviceProviderId with Redux state
  useEffect(() => {
    if (selectedServiceProviderId !== null) {
      setServiceProviderId(selectedServiceProviderId);
      dispatch(fetchStations(selectedServiceProviderId));
    }
  }, [dispatch, selectedServiceProviderId]);

  // Handle logout
  const handleLogout = () => {
    dispatch(logOut());
    navigate("/");
  };

  const handleEditStation = (stationId) => {
    navigate(`/station/${stationId}`);
  };

  if (userstate.loading) {
    return <div>Loading...</div>;
  }

  if (!userstate.user) {
    navigate("/");
    return null;
  }

  const { username } = userstate.user;

  return (
    <ThemeProvider theme={theme}>
      <div className="dashboard-container">
        <div className="header">
          <h2>Welcome, {username || "Guest"}!</h2>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <ServiceProviderSelect />

        <div className="station-list">
          <Typography variant="h3">List of Stations:</Typography>
          <List>
            {stations.length > 0 ? (
              stations.map((station) => (
                <ListItem key={station.id}>
                  <ListItemText primary={station.name} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="Edit"
                      onClick={() => handleEditStation(station.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))
            ) : (
              <Typography>No stations available.</Typography>
            )}
          </List>
        </div>

        <div className="create-station-button">
          <Link to="/create-station">
            <Button variant="contained" color="primary">
              Create Station
            </Button>
          </Link>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Dashboard;
