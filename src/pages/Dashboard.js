import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../slices/userSlice";
import { fetchStations, deleteStation } from "../slices/stationsSlice";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import Button from "@mui/material/Button"; // Import MUI Button
import ServiceProviderSelect from "../components/ServiceProviderSelect";

const Dashboard = () => {
  const dispatch = useDispatch();
  const userstate = useSelector(selectUser);
  console.log(userstate);

  const stations = useSelector((state) => state.station.stations);
  const [serviceProviderId, setServiceProviderId] = useState(0);

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

  const handleDeleteStation = (stationId) => {
    dispatch(deleteStation(stationId));
  };

  if (userstate.loading) {
    // Optionally, you can render a loading indicator or a message here
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <h2>Welcome, {userstate.user ? userstate.user.username : "Guest"}!</h2>

        <ServiceProviderSelect />
        <h3>List of Stations:</h3>
        <ul>
          {stations.map((station) => (
            <li key={station.id}>
              {station.name}
              <button onClick={() => handleDeleteStation(station.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
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
    );
  }
};

export default Dashboard;
