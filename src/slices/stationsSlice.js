import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const stationsSlice = createSlice({
  name: "stations",
  initialState: {
    stations: [],
  },
  error: null,
  reducers: {
    getStationsSuccess: (state, action) => {
      console.log(action.payload.data);
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
      .get("http://localhost:7001/v1/stations/service-provider/" + id)
      .then((payload) => dispatch(getStationsSuccess(payload)))
      .catch((error) => console.error("Error fetching stations:", error));
  } catch (error) {
    console.error("Error fetching stations:", error);
  }
};

export const createStation = (station) => async (dispatch) => {
  console.log(station.data);

  // Construct the URL with all request parameters as query parameters
  const url = new URL("http://localhost:7001/v1/stations/");
  url.searchParams.append("name", station.data.name);
  url.searchParams.append("address", station.data.address);
  url.searchParams.append("latitude", station.data.latitude.toString());
  url.searchParams.append("longitude", station.data.longitude.toString());
  url.searchParams.append(
    "serviceProvider",
    station.data.serviceProvider.toString()
  );
  url.searchParams.append("media", station.data.media);
  try {
    // Make an API request to sign in the user
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => dispatch(getStationsSuccess(data)))
      .then((data) => console.log(data))
      .catch((err) => dispatch(stationError(err)));
  } catch (error) {
    console.error("Error getting stations: ", error);
  }
};

export const deleteStation = (id) => async (dispatch) => {
  try {
    // Make an API request to sign in the user
    await fetch("http://localhost:7001/v1/stations" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => response.json())
      .then((data) => dispatch(getStationsSuccess(data)))
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  } catch (error) {
    console.error("Error getting stations: ", error);
  }
};

export const updateStationAddress =
  (stationId, stationWithNewAddress) => async (dispatch) => {
    try {
      console.log(stationWithNewAddress);
      // Make an API request to update the station's address
      const response = await axios.put(
        `http://localhost:7001/v1/stations/address/${stationId}`,
        stationWithNewAddress
      );

      // Dispatch the success action with the updated station data
      dispatch(updateStationAddressSuccess(response.data));
    } catch (error) {
      console.error("Error updating station address:", error);
    }
  };

export default stationsSlice.reducer;
