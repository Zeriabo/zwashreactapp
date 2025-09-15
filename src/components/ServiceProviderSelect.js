import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedServiceProvider, fetchUserServiceProviders } from "../slices/serviceProvidersSlice";

const ServiceProviderSelect = () => {
  const dispatch = useDispatch();

  // Use optional chaining + default empty array
  const serviceProviders = useSelector(
    (state) => state.serviceProviders?.list || []
  );

  const selectedServiceProviderId = useSelector(
    (state) => state.serviceProviders?.selectedServiceProviderId || null
  );

  useEffect(() => {
    // Example: fetch service providers for the logged-in user
    dispatch(fetchUserServiceProviders("username"));
  }, [dispatch]);

  const handleChange = (e) => {
    dispatch(setSelectedServiceProvider(e.target.value));
  };

  // Early return if list is empty
  if (!serviceProviders || serviceProviders.length === 0) {
    return <div>No service providers available.</div>;
  }

  return (
    <select value={selectedServiceProviderId || ""} onChange={handleChange}>
      {serviceProviders.map((sp) => (
        <option key={sp.id} value={sp.id}>
          {sp.name}
        </option>
      ))}
    </select>
  );
};

export default ServiceProviderSelect;
