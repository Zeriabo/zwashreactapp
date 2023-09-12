import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, logOut } from "../slices/userSlice";
import { fetchStations, deleteStation } from "../slices/stationsSlice";
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
  // Customize your theme here
  palette: {
    primary: {
      main: "#007bff", // Your primary color
    },
    secondary: {
      main: "#ff5722", // Your secondary color
    },
  },
  // Add more theme configurations as needed
});

const Dashboard = () => {
  const dispatch = useDispatch();
  const userstate = useSelector(selectUser);

  const stations = useSelector((state) => state.station.stations);
  console.log(stations);
  const [serviceProviderId, setServiceProviderId] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    if (userstate.loading == false && userstate.error == null) {
      setServiceProviderId(userstate.user.id);

      dispatch(fetchStations(userstate.user.id));
    }
  }, [dispatch, userstate]);

  const handleEditStation = (stationId) => {
    navigate(`/station/${stationId}`);
  };
  const handleLogout = () => {
    dispatch(logOut());
    navigate("/");
  };

  if (userstate.loading) {
    // Optionally, you can render a loading indicator or a message here
    return <div>Loading...</div>;
  } else if (userstate.loading == false && userstate.user != null) {
    const { username } = userstate.user;
    return (
      <ThemeProvider theme={theme}>
        <div className="dashboard-container">
          <div className="header">
            <h2>Welcome, {username ? username : "Guest"}!</h2>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
          <ServiceProviderSelect />
          <div className="station-list">
            <Typography variant="h3">List of Stations:</Typography>
            <List>
              {stations?.map((station) => (
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
              ))}
            </List>
          </div>
          <div className="create-station-button">
            <Link
              to={{
                pathname: "/create-station",
              }}
            >
              <Button variant="contained" color="primary">
                Create Station
              </Button>
            </Link>
          </div>
        </div>
      </ThemeProvider>
    );
  } else {
    navigate("/");
    return null;
  }
};

export default Dashboard;
