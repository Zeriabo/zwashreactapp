import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserServiceProviders } from "../slices/serviceProvidersSlice";
import { selectUser } from "../slices/userSlice";
import { fetchStations } from "../slices/stationsSlice";
const ServiceProviderSelect = () => {
  const dispatch = useDispatch();
  const userstate = useSelector(selectUser);
  const [selectedServiceProviderId, setSelectedServiceProviderId] = useState(0);
  const serviceProviders = useSelector(
    (state) => state.serviceProvider.serviceProviders
  );
  console.log(serviceProviders);
  useEffect(() => {
    if (userstate.loading === false && userstate.error === null) {
      dispatch(fetchUserServiceProviders(userstate.user.username));
    }
  }, [dispatch, userstate]);

  const handleServiceProviderChange = (e) => {
    const selectedId = e.target.value;
    setSelectedServiceProviderId(selectedId);
    // Fetch stations based on the selected service provider ID here
    //  dispatch an action to fetch stations
    dispatch(fetchStations(selectedId));
  };
  console.log(serviceProviders);
  return (
    <div>
      <h3>Select a Service Provider:</h3>
      <select
        value={selectedServiceProviderId}
        onChange={handleServiceProviderChange}
      >
        <option value={0}>Select a Service Provider</option>
        {serviceProviders.map((provider) => (
          <option key={provider.id} value={provider.id}>
            {provider.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ServiceProviderSelect;
