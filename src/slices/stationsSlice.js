// slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const stationsSlice = createSlice({
  name: "stations",
  initialState: {
    stations: [],
  },
  reducers: {
    getStationsSuccess: (state, action) => {
      state.stations = action.payload;
    },
  },
});
export const { getStationsSuccess } = stationsSlice.actions;

export const fetchStations = (id) => async (dispatch) => {
  try {
    console.log(id);
    // Make an API request to sign in the user
    const response = await fetch(
      "http://localhost:7001/v1/stations/service_provider/" + id,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      dispatch(getStationsSuccess(data));
    } else {
      console.error("Error fetching stations:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching stations:", error);
  }
};
export const createStation = (station) => async (dispatch) => {
  try {
    console.log(station);
    // Make an API request to sign in the user
    const response = await fetch("http://localhost:7001/v1/stations/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify(station),
    })
      .then((response) => response.json())
      .then((data) => dispatch(getStationsSuccess(data)))
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  } catch (error) {
    console.error("Error getting stations: ", error);
  }
};
export const deleteStation = (id) => async (dispatch) => {
  try {
    console.log(id);
    // Make an API request to sign in the user
    const response = await fetch("http://localhost:7001/v1/stations" + id, {
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
export default stationsSlice.reducer;
