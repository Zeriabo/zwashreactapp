import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;
const stationsSlice = createSlice({
  name: "stations",
  initialState: {
    stations: [],
  },
  error: null,
  reducers: {
    getStationsSuccess: (state, action) => {
      state.stations = action.payload.data;
    },
    updateStationAddressSuccess: (state, action) => {
      // Update the address of the station in the state
      const updatedStation = action.payload;
      const updatedStations = state.stations.map((station) => {
        if (station.id === updatedStation.id) {
          return { ...station, address: updatedStation.address };
        }
        return station;
      });
      state.stations = updatedStations;
    },
    stationError: (state, action) => {
      state.error = action.payload;
    },
    resetStations: (state) => {
      state.stations = [];
      state.error = null;
    },
    deleteStation: (state, action) => {
      state.stations = state.stations.filter(
        (station) => station.id !== action.payload
      );
    },
  },
});

export const {
  getStationsSuccess,
  updateStationAddressSuccess,
  stationError,
  resetStations,
} = stationsSlice.actions;

export const fetchStations = (id) => async (dispatch) => {
  try {
    // Make an API request to get the station of a service provider
    axios
      .get(`${API_BASE_URL}:8092/v1/service-provider/stations/` + id)
      .then((payload) => dispatch(getStationsSuccess(payload)))
      .catch((error) => console.error("Error fetching stations:", error));
  } catch (error) {
    console.error("Error fetching stations:", error);
  }
};

export const createStation = (station) => async (dispatch) => {
  try {
    const response = await fetch(`${API_BASE_URL}:8080/stations/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: station.data.name,
        address: station.data.address,
        latitude: station.data.latitude,
        longitude: station.data.longitude,
        serviceProvider: station.data.serviceProvider,
        logoFile: station.data.media.logoFile,
        pictureFile: station.data.media.pictureFile,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create station: ${response.statusText}`);
    }

    const data = await response.json();
    dispatch(getStationsSuccess(data));
    console.log("Station created:", data);
  } catch (err) {
    console.error("Error creating station:", err);
    dispatch(stationError(err));
  }
};

const removeStation = (id) => ({
  type: "stations/removeStation",
  payload: id,
});

export const deleteStation = (id) => async (dispatch) => {
  try {
    // Make an API request to sign in the user
    await fetch(`${API_BASE_URL}:8080/stations/`+ id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => response.json())

      .then((data) => console.log(data))
      .then(() => dispatch(removeStation(id)))
      .catch((err) => console.error(err));
  } catch (error) {
    console.error("Error getting stations: ", error);
  }
};

export const updateStationAddress =
  (stationId, stationWithNewAddress) => async (dispatch) => {
    try {
      // Make an API request to update the station's address
      const response = await axios.put(
        `${API_BASE_URL}:8080/stations/address/${stationId}`,
        stationWithNewAddress
      );

      // Dispatch the success action with the updated station data
      dispatch(updateStationAddressSuccess(response.data));
    } catch (error) {
      console.error("Error updating station address:", error);
    }
  };

export const updateStation =
  (stationId, stationWithNewAddress) => async (dispatch) => {
    try {
      // Make an API request to update the station's address
      const response = await axios.put(
        `${API_BASE_URL}:8080/stations/${stationId}`,
        stationWithNewAddress
      );

      // Dispatch the success action with the updated station data
      dispatch(updateStationAddressSuccess(response.data));
    } catch (error) {
      console.error("Error updating station address:", error);
    }
  };

export default stationsSlice.reducer;
