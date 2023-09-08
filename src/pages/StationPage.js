import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import MapPicker from "react-google-map-picker";
import { updateStationAddress } from "../slices/stationsSlice";
import { useDispatch } from "react-redux";
import { fetchProgramsForStation } from "../slices/programsSlice";
import ProgramList from "../components/ProgramList";
import {
  Button,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { CheckCircle, TempleBuddhist } from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

const StationPage = () => {
  const { stationId } = useParams();
  const dispatch = useDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [stationAddress, setStationAddress] = useState(""); // State for the station address
  const [tempAddress, setTempAddress] = useState(""); // State for temporary address during confirmation
  const [tempLocation, setTempLocation] = useState({});
  const station = useSelector((state) => {
    return state.station.stations.find((s) => s.id === Number(stationId));
  });
  useEffect(() => {
    dispatch(fetchProgramsForStation(stationId));
  }, [stationId]);
  const [DefaultLocation, setDefaultLocation] = useState({
    lat: station.latitude,
    lng: station.longitude,
  });
  const programs = useSelector((state) => {
    return state.programs.programs;
  });

  const [updateSuccess, setUpdateSuccess] = useState(false); // State for update success snackbar
  const [loading, setLoading] = useState(false); // State for loading indicator

  if (!station) {
    return <div>Station not found</div>;
  }

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const handleChangeLocation = (lat, lng) => {
    // Handle location change here
    const updatedLocation = {
      lat: lat !== undefined ? lat : DefaultLocation.lat,
      lng: lng !== undefined ? lng : DefaultLocation.lng,
    };
    // Create a copy of the station object with updated latitude and longitude

    setTempLocation(updatedLocation);
    // Show a confirmation dialog before changing the address

    setIsDialogOpen(true);
  };
  const handleCancelUpdateAddress = () => {
    setDefaultLocation(DefaultLocation);
    console.log(DefaultLocation);
    setIsDialogOpen(false);
  };
  const handleUpdateAddress = async () => {
    // Optionally, you can clear the input field or show a success message
    setLoading(true);

    setIsDialogOpen(false);

    const updatedStation = {
      ...station,
      latitude: tempLocation.lat,
      longitude: tempLocation.lng,
    };

    try {
      // Simulate an API request with a delay (you can replace this with your actual API call)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Dispatch the action to update the address
      dispatch(updateStationAddress(stationId, updatedStation));

      // Display the success message and change the pointer on the map
      setUpdateSuccess(true);
      setDefaultLocation(tempLocation);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setUpdateSuccess(false);
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Confirm Address Change</DialogTitle>
        <DialogContent>
          Are you sure you want to change the address to the following address?
          <br />
          <strong>{tempAddress}</strong>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCancelUpdateAddress()} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateAddress} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <h2>Station Details</h2>
      <p>Name: {station.name}</p>
      <p>Address: {station.address}</p>

      {/* Input field for the new address */}
      <div>
        <label htmlFor="newAddress">New Address:</label>
        <input
          type="text"
          id="newAddress"
          value={tempAddress} // Use tempAddress for input value
          onChange={(e) => setTempAddress(e.target.value)}
        />
      </div>

      {/* Button to update the address */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleChangeLocation} // Show confirmation dialog on button click
        disabled={loading}
      >
        Update Address
      </Button>
      {loading && <CircularProgress />}
      <ProgramList programs={programs} />
      <MapPicker
        mapContainerStyle={mapContainerStyle}
        defaultLocation={DefaultLocation}
        zoom={13}
        mapTypeId="roadmap"
        style={{ height: "400px", marginTop: "20px" }}
        onChangeLocation={handleChangeLocation}
        apiKey="AIzaSyDLSwn-vtm6HJwMuAM_iflsezLRB1BkPyA"
      />
      {/* Snackbar for update success */}
      <Snackbar
        open={updateSuccess}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" icon={<CheckCircle />}>
          Address updated successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default StationPage;
