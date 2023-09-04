import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../slices/userSlice";
import { fetchStations, deleteStation } from "../slices/stationsSlice";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import Button from "@mui/material/Button"; // Import MUI Button

const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const stations = useSelector((state) => state.station.stations);

  useEffect(() => {
    if (user) {
      dispatch(fetchStations(user.id));
    }
  }, [dispatch, user]);

  const handleDeleteStation = (stationId) => {
    dispatch(deleteStation(stationId));
  };

  return (
    <div>
      <h2>Welcome, {user ? user.username : "Guest"}!</h2>

      {/* Link to the "Create Station" page */}
      <Link to="/create-station">
        <Button variant="contained" color="primary">
          Create Station
        </Button>
      </Link>

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
    </div>
  );
};

export default Dashboard;
