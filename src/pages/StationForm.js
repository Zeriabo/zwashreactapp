import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStation, deleteStation } from "../slices/stationsSlice";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import MapPicker from "react-google-map-picker";
import { useLocation } from "react-router-dom";
import { selectUser } from "../slices/userSlice";
const DefaultLocation = { lat: 60.1699, lng: 24.9384 };
const DefaultZoom = 10;

const StationForm = () => {
  const [serviceProviderId, setServiceProviderId] = useState(0);
  const dispatch = useDispatch();
  const [stationName, setStationName] = useState("");
  const [address, setAddress] = useState("");
  const userstate = useSelector(selectUser);
  console.log(userstate);
  const [logoFile, setLogoFile] = useState({}); // Logo file
  const [pictureFile, setPictureFile] = useState({}); // Picture file
  const [defaultLocation, setDefaultLocation] = useState(DefaultLocation);

  const [location, setLocation] = useState(defaultLocation);
  const [zoom, setZoom] = useState(DefaultZoom);

  useEffect(() => {
    // Initialize the Google Maps Geocoder here, after the API has loaded
    const geocoder = new window.google.maps.Geocoder();
  }, []);
  function handleChangeLocation(lat, lng) {
    console.log(lat, lng);
    setLocation({ lat: lat, lng: lng });
  }

  function handleChangeZoom(newZoom) {
    setZoom(newZoom);
  }

  function handleResetLocation() {
    setDefaultLocation({ ...DefaultLocation });
    setZoom(DefaultZoom);
  }
  const handleCreateStation = () => {
    setServiceProviderId(userstate.user.id);
    console.log(serviceProviderId);
    const station = {
      name: stationName,
      address: address,
      media: {
        logoFile: logoFile,
        pictureFile: pictureFile,
      },
      latitude: location.lat,
      longitude: location.lng,
      serviceProvider: serviceProviderId,
    };

    console.log("Request Data:", JSON.stringify(station)); // Log the request data

    // Create a new station and dispatch the action
    // dispatch(createStation(station));
    dispatch(
      createStation({
        data: station,
      })
    );
    // Clear the input fields
    // setStationName("");
    // setLocation(DefaultLocation); // Reset location to the default
    // setLogoFile(null);
    // setPictureFile(null);
  };

  const handleDeleteStation = (stationId) => {
    // Delete the station and dispatch the action
    dispatch(deleteStation(stationId));
  };

  return (
    <div>
      <h3>Create a New Station</h3>
      <TextField
        label="Station Name"
        variant="outlined"
        value={stationName}
        onChange={(e) => setStationName(e.target.value)}
        fullWidth
        margin="normal"
      />

      <InputLabel>Location</InputLabel>
      <TextField
        label="Address"
        variant="outlined"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        fullWidth
        margin="normal"
      />
      <MapPicker
        defaultLocation={location}
        zoom={13} // Adjust zoom level as needed
        mapTypeId="roadmap"
        style={{ height: "400px", marginTop: "20px" }}
        onChangeLocation={handleChangeLocation}
        apiKey="AIzaSyDLSwn-vtm6HJwMuAM_iflsezLRB1BkPyA"
      />
      <InputLabel>Logo</InputLabel>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setLogoFile(e.target.files[0])}
      />
      <InputLabel>Picture</InputLabel>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPictureFile(e.target.files[0])}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateStation}
        style={{ marginTop: "20px" }}
      >
        Create Station
      </Button>
    </div>
  );
};

export default StationForm;
