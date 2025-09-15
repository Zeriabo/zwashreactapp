import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import MapPicker from "react-google-map-picker";
import ProgramList from "../components/ProgramList";
import { fetchProgramsForStation, deleteProgram } from "../slices/programsSlice";
import { updateStationAddress, deleteStation } from "../slices/stationsSlice";
import {
  Button,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { CheckCircle, Delete } from "@mui/icons-material";

const StationPage = () => {
  const { stationId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [stationAddress, setStationAddress] = useState("");
  const [tempLocation, setTempLocation] = useState({});
  const [showMap, setShowMap] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteSnackbarOpen, setDeleteSnackbarOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);

  const station = useSelector((state) =>
    state.station.stations.find((s) => s.id === Number(stationId))
  );

  const programs = useSelector((state) => state.programs.programs);

  const DefaultLocation = {
    lat: station?.latitude,
    lng: station?.longitude,
  };

  useEffect(() => {
    if (station) {
      dispatch(fetchProgramsForStation(stationId));
      setStationAddress(station.address);
    }
    const delay = setTimeout(() => setShowMap(true), 500);
    return () => clearTimeout(delay);
  }, [station, stationId, dispatch]);

  const handleChangeAddress = async () => {
    setLoading(true);
    try {
      const updatedStation = { ...station, address: stationAddress };
      await new Promise((resolve) => setTimeout(resolve, 2000));
      dispatch(updateStationAddress(stationId, updatedStation));
      setUpdateSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeLocation = (lat, lng) => {
    setTempLocation({ lat, lng });
    setIsDialogOpen(true);
  };

  const handleUpdateAddress = async () => {
    setLoading(true);
    setIsDialogOpen(false);
    try {
      const updatedStation = { ...station, latitude: tempLocation.lat, longitude: tempLocation.lng };
      await new Promise((resolve) => setTimeout(resolve, 2000));
      dispatch(updateStationAddress(stationId, updatedStation));
      setUpdateSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStation = () => setConfirmDeleteDialogOpen(true);

  const handleConfirmDelete = () => {
    dispatch(deleteStation(stationId))
      .then(() => {
        setDeleteSuccess(true);
        setDeleteSnackbarOpen(true);
        setConfirmDeleteDialogOpen(false);
        navigate("/dashboard");
      })
      .catch(console.error);
  };

  const handleDeleteProgram = (programId) => {
    dispatch(deleteProgram(programId)).then(() => {
      dispatch(fetchProgramsForStation(stationId));
    });
  };

  const handleAddProgram = () => navigate(`/AddProgram/${stationId}`);
  const handleGoToAccounting = () => navigate(`/station/accounting/${stationId}`);
  const handleCloseSnackbar = () => {
    setUpdateSuccess(false);
    setDeleteSnackbarOpen(false);
  };

  if (!station) return <div>Station not found</div>;

  return (
    <div>
      <Button variant="contained" color="secondary" onClick={() => navigate("/dashboard")}>
        Back
      </Button>

      {showMap && (
        <MapPicker
          mapContainerStyle={{ width: "100%", height: "400px" }}
          defaultLocation={DefaultLocation}
          zoom={13}
          mapTypeId="roadmap"
          onChangeLocation={handleChangeLocation}
          apiKey="AIzaSyDLSwn-vtm6HJwMuAM_iflsezLRB1BkPyA"
        />
      )}

      <Button variant="contained" color="primary" onClick={handleGoToAccounting}>
        Accounting
      </Button>

      <Snackbar open={updateSuccess} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert severity="success" icon={<CheckCircle />}>Address updated successfully!</Alert>
      </Snackbar>
      <Snackbar open={deleteSnackbarOpen} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert severity="success" icon={<CheckCircle />}>Station deleted successfully!</Alert>
      </Snackbar>

      <Dialog open={confirmDeleteDialogOpen} onClose={() => setConfirmDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this station?</DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDelete} color="primary">Confirm</Button>
          <Button onClick={() => setConfirmDeleteDialogOpen(false)} color="secondary">Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Confirm Address Change</DialogTitle>
        <DialogContent>
          Are you sure you want to change the address to: <strong>{stationAddress}</strong>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="primary">Cancel</Button>
          <Button onClick={handleUpdateAddress} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>

      <h2>Station Details</h2>
      <p>Name: {station.name}</p>
      <p>Address: {station.address}</p>
      <div>
        <input type="text" value={stationAddress} onChange={(e) => setStationAddress(e.target.value)} />
        <Button variant="contained" color="primary" onClick={handleChangeAddress} disabled={loading}>
          Update Address
        </Button>
        <IconButton onClick={handleDeleteStation} color="error" disabled={loading}>
          <Delete />
        </IconButton>
        {loading && <CircularProgress />}
      </div>

      {/* Program List with Delete */}
      <ProgramList programs={programs} onDeleteProgram={handleDeleteProgram} />

      <Button variant="contained" color="primary" onClick={handleAddProgram} disabled={loading}>
        Add Program
      </Button>
    </div>
  );
};

export default StationPage;
