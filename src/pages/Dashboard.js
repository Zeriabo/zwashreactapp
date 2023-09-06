import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, logOut } from "../slices/userSlice";
import { fetchStations, deleteStation } from "../slices/stationsSlice";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import ServiceProviderSelect from "../components/ServiceProviderSelect";
import "./Dashboard.css";

const Dashboard = () => {
  const dispatch = useDispatch();
  const userstate = useSelector(selectUser);
  console.log(userstate);

  const stations = useSelector((state) => state.station.stations);
  const [serviceProviderId, setServiceProviderId] = useState(0);
  const navigate = useNavigate();
  const fetchStationsByServiceProvider = (providerId) => {
    dispatch(fetchStations(providerId));
  };
  useEffect(() => {
    if (userstate.loading == false && userstate.error == null) {
      console.log(userstate.user);
      setServiceProviderId(userstate.user.id);

      dispatch(fetchStations(userstate.user.id));
    }
  }, [dispatch, userstate]);

  const handleEditStation = (stationId) => {
    dispatch(deleteStation(stationId));
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
      <div className="dashboard-container">
        <div className="header">
          <h2>Welcome, {username ? username : "Guest"}!</h2>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <ServiceProviderSelect />
        <div className="station-list">
          <h3>List of Stations:</h3>
          <ul>
            {stations.map((station) => (
              <li key={station.id}>
                {station.name}
                <button onClick={() => handleEditStation(station.id)}>
                  Edit
                </button>
              </li>
            ))}
          </ul>
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
    );
  } else {
    navigate("/");
    return null;
  }
};

export default Dashboard;
