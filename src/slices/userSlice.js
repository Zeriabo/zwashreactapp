import { createSlice } from "@reduxjs/toolkit";
import { getServiceProvidersSuccess, fetchUserServiceProviders } from "./serviceProvidersSlice";
import { fetchStations } from "./stationsSlice";
import axios from "axios";


const API_BASE_URL = process.env.REACT_APP_API_URL;

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    logOut: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const signIn = (username, password) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    await axios
      .post(
        `${API_BASE_URL}:8092/v1/serviceprovideruser/signin`,
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      )
      .then(async (userData) => {
        dispatch(setUser(userData.data));
        dispatch(fetchStations(userData.data.id));
        dispatch(fetchUserServiceProviders(userData.data.username));
        dispatch(setLoading(false));
      })
      .catch((error) => {
        console.error(error);
        dispatch(setError(error));
      });
  } catch (error) {
    console.error("Error signing in:", error);
    dispatch(setError("An error occurred while signing in."));
  }
};

export const registerUser = (user) => async (dispatch) => {
  try {
    const response = await fetch(`${API_BASE_URL}:8092/v1/serviceprovideruser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (response.status === 201) {
      const userData = await response.json();
      dispatch(setUser(userData));
    } else {
      console.error("User registration failed");
    }
  } catch (error) {
    console.error("Error registering user:", error);
  }
};

export const { setUser, setLoading, setError, logOut } = userSlice.actions;

export const selectUser = (state) => state.user;
export const selectLoading = (state) => state.user.loading;
export const selectError = (state) => state.user.error;

export default userSlice.reducer;
