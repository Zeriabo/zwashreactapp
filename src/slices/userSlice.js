// slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const signIn = (username, password) => async (dispatch) => {
  try {
    console.log(username, password);
    // Make an API request to sign in the user
    const response = await fetch(
      "http://localhost:7001/v1/service-provider-users/signin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `username=${username}&password=${password}`,
      }
    )
      .then((response) => response.json())
      .then((data) => dispatch(setUser(data)))
      .catch((err) => console.error(err));
  } catch (error) {
    console.error("Error signing in:", error);
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

export const { setUser } = userSlice.actions;

export const selectUser = (state) => state.user.user;

export default userSlice.reducer;
