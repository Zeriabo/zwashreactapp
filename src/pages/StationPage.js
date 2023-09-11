import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import MapPicker from "react-google-map-picker";
import { updateStationAddress, deleteStation } from "../slices/stationsSlice";
import { useDispatch } from "react-redux";
import { fetchProgramsForStation } from "../slices/programsSlice";
import ProgramList from "../components/ProgramList";
import { updateStation } from "../slices/stationsSlice";
import {
  Button,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Dialog, // Import Dialog component
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { CheckCircle, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
const StationPage = () => {
  const { stationId } = useParams();
  const dispatch = useDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [stationAddress, setStationAddress] = useState("");
  const [tempLocation, setTempLocation] = useState({});
  const navigate = useNavigate();
  const station = useSelector((state) => {
    return state.station.stations.find((s) => s.id === Number(stationId));
  });

  useEffect(() => {
    dispatch(fetchProgramsForStation(stationId));
    setStationAddress(station.address);
  }, [stationId]);

  const [DefaultLocation, setDefaultLocation] = useState({
    lat: station.latitude,
    lng: station.longitude,
  });
  const programs = useSelector((state) => {
    return state.programs.programs;
  });

  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [deleteSnackbarOpen, setDeleteSnackbarOpen] = useState(false);

  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false); // State for confirmation dialog

  if (!station) {
    return <div>Station not found</div>;
  }

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };
  const handleChangeAddress = async () => {
    try {
      const updatedStation = {
        ...station,
        address: stationAddress,
      };
      // Simulate an API request with a delay (you can replace this with your actual API call)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      dispatch(updateStation(stationId, updatedStation));
      setUpdateSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleChangeLocation = (lat, lng) => {
    const updatedLocation = {
      lat: lat !== undefined ? lat : DefaultLocation.lat,
      lng: lng !== undefined ? lng : DefaultLocation.lng,
    };

    setTempLocation(updatedLocation);
    setIsDialogOpen(true);
  };

  const handleCancelUpdateAddress = () => {
    setDefaultLocation(DefaultLocation);
    setIsDialogOpen(false);
  };

  const handleUpdateAddress = async () => {
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

      dispatch(updateStationAddress(stationId, updatedStation));
      setUpdateSuccess(true);
      setDefaultLocation(tempLocation);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStation = () => {
    setConfirmDeleteDialogOpen(true); // Open the confirmation dialog
  };

  const handleConfirmDelete = () => {
    dispatch(deleteStation(stationId))
      .then(() => {
        setDeleteSuccess(true);
        setDeleteSnackbarOpen(true);
        setConfirmDeleteDialogOpen(false); // Close the confirmation dialog
      })
      .catch((error) => {
        console.error("Error deleting station:", error);
      });
    navigate("dashboard");
  };

  const handleDeleteSnackbarClose = () => {
    setDeleteSnackbarOpen(false);
  };

  const handleConfirmDeleteDialogClose = () => {
    setConfirmDeleteDialogOpen(false); // Close the confirmation dialog
  };
  const handleCloseSnackbar = () => {
    setUpdateSuccess(false);
  };
  const handleAddProgram = () => {
    navigate(`/AddProgram/${stationId}`);
  };

  return (
    <div>
      <Dialog
        open={confirmDeleteDialogOpen}
        onClose={handleConfirmDeleteDialogClose}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this station?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDelete} color="primary">
            Confirm
          </Button>
          <Button onClick={handleConfirmDeleteDialogClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Confirm Address Change</DialogTitle>
        <DialogContent>
          Are you sure you want to change the address to the following address?
          <br />
          <strong>{stationAddress}</strong>
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
      <div>
        <label htmlFor="newAddress">New Address:</label>
        <input
          type="text"
          id="newAddress"
          value={stationAddress}
          onChange={(e) => setStationAddress(e.target.value)}
        />
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleChangeAddress}
        disabled={loading}
      >
        Update Address
      </Button>
      <IconButton
        onClick={handleDeleteStation}
        color="error"
        aria-label="delete"
        disabled={loading}
      >
        <Delete />
      </IconButton>
      {loading && <CircularProgress />}

      <ProgramList programs={programs} />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddProgram}
        disabled={loading}
      >
        Add program
      </Button>
      <MapPicker
        mapContainerStyle={mapContainerStyle}
        defaultLocation={DefaultLocation}
        zoom={13}
        mapTypeId="roadmap"
        style={{ height: "400px", marginTop: "20px" }}
        onChangeLocation={handleChangeLocation}
        apiKey="AIzaSyDLSwn-vtm6HJwMuAM_iflsezLRB1BkPyA"
      />
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
      <Snackbar
        open={deleteSnackbarOpen}
        autoHideDuration={4000}
        onClose={handleDeleteSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" icon={<CheckCircle />}>
          Station deleted successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default StationPage;
