import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_URL;
const serviceProvidersSlice = createSlice({
  name: "serviceProviders",
  initialState: {
    list: [], 
    selectedServiceProviderId: null,
  },
  reducers: {
    getServiceProvidersSuccess: (state, action) => {
      state.list = action.payload;
      state.selectedServiceProviderId = action.payload[0].id;
      
    },
    createServiceProviderSuccess: (state, action) => {
      state.list.push(action.payload);
    },
    setSelectedServiceProvider: (state, action) => {
      state.selectedServiceProviderId = action.payload;
    },
  },
});

export const { getServiceProvidersSuccess, createServiceProviderSuccess,  setSelectedServiceProvider } =
  serviceProvidersSlice.actions;

// Async action to fetch all service providers of a user
export const fetchUserServiceProviders = (username) => async (dispatch) => {
  axios
    .get(`${API_BASE_URL}:8092/v1/service-provider/user/${username}`)
    .then((response) => dispatch(getServiceProvidersSuccess(response.data)))
    .catch((err) => console.log(err));
};

// Async action to create a new service provider
export const createNewServiceProvider =
  (serviceProvider) => async (dispatch) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}8092/v1/service-provider/`,
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
