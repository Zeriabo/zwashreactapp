import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserServiceProviders } from "../slices/serviceProvidersSlice";
import { selectUser } from "../slices/userSlice";
import { fetchStations } from "../slices/stationsSlice";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
function useFetchServiceProviders(username, dispatch) {
  useEffect(() => {
    if (username) {
      dispatch(fetchUserServiceProviders(username));
    }
  }, [username, dispatch]);
}
const ServiceProviderSelect = () => {
  const dispatch = useDispatch();
  const userstate = useSelector(selectUser);
  const [selectedServiceProviderId, setSelectedServiceProviderId] = useState(0);
  const serviceProviders = useSelector(
    (state) => state.serviceProvider.serviceProviders
  );

  useFetchServiceProviders(userstate.user.username, dispatch);

  const handleServiceProviderChange = (e) => {
    const selectedId = e.target.value;
    setSelectedServiceProviderId(selectedId);
    dispatch(fetchStations(selectedId));
  };
  return (
    <div>
      <h3>Select a Service Provider:</h3>
      <FormControl variant="outlined" fullWidth>
        <InputLabel>Service Provider</InputLabel>
        <Select
          value={selectedServiceProviderId}
          onChange={handleServiceProviderChange}
          label="Service Provider"
        >
          <MenuItem value={0}>Select a Service Provider</MenuItem>
          {serviceProviders.map((provider) => (
            <MenuItem key={provider.id} value={provider.id}>
              {provider.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default ServiceProviderSelect;
