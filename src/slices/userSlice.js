// slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { getServiceProvidersSuccess } from "./serviceProvidersSlice";
import { fetchUserServiceProviders } from "./serviceProvidersSlice";
import { fetchStations } from "./stationsSlice";
import axios from "axios";
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

    // await axios
    //   .get(" http://localhost:7001/v1/stations/")
    //   .then((resul) => console.log(resul))
    //   .catch((err) => console.log(err));

    // API request to sign in the user
    await axios
      .post(
        "http://localhost:7001/v1/service-provider-users/signin",
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(async (userData) => {
        dispatch(setUser(userData.data));
        dispatch(fetchStations(userData.data.id));
        dispatch(setLoading(false));
        dispatch(fetchUserServiceProviders(userData.data.username));
        dispatch(setLoading(false));
      })
      .catch((error) => {
        console.log(error);
        dispatch(setError(error));
      });
  } catch (error) {
    console.error("Error signing in:", error);
    dispatch(setError("An error occurred while signing in."));
  }
};
export const registerUser = (user) => async (dispatch) => {
  try {
    // Make an API request to register the user
    const response = await fetch(
      "http://localhost:7001/v1/service-provider-users/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      }
    );

    if (response.status === 201) {
      const userData = await response.json();
      // Dispatch the setUser action with the user data
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
