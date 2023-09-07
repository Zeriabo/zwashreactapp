import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const serviceProvidersSlice = createSlice({
  name: "serviceProviders",
  initialState: {
    serviceProviders: [],
  },
  reducers: {
    getServiceProvidersSuccess: (state, action) => {
      state.serviceProviders = action.payload;
    },
    createServiceProviderSuccess: (state, action) => {
      state.serviceProviders.push(action.payload);
    },
  },
});

export const { getServiceProvidersSuccess, createServiceProviderSuccess } =
  serviceProvidersSlice.actions;

// Async action to fetch all service providers of a user
export const fetchUserServiceProviders = (username) => async (dispatch) => {
  axios
    .get(`http://localhost:7001/v1/service-providers/user?username=${username}`)
    .then((response) => dispatch(getServiceProvidersSuccess(response.data)))
    .catch((err) => console.log(err));
};

// Async action to create a new service provider
export const createNewServiceProvider =
  (serviceProvider) => async (dispatch) => {
    try {
      const response = await fetch(
        "http://localhost:7001/v1/service-providers/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(serviceProvider),
        }
      );
      if (response.ok) {
        const data = await response.json();
        dispatch(createServiceProviderSuccess(data));
      } else {
        console.error("Error creating service provider:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating service provider:", error);
    }
  };

export default serviceProvidersSlice.reducer;
