import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedServiceProvider,
  fetchUserServiceProviders,
} from "../slices/serviceProvidersSlice";

const ServiceProviderSelect = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);

  const serviceProviders = useSelector(
    (state) => state.serviceProviders?.list || []
  );

  const selectedServiceProviderId = useSelector(
    (state) => state.serviceProviders?.selectedServiceProviderId || ""
  );

  useEffect(() => {
    if (user?.username) {
      dispatch(fetchUserServiceProviders(user.username));
    }
  }, [dispatch, user?.username]);

  const handleChange = (e) => {
    const value = e.target.value ? Number(e.target.value) : null;
    dispatch(setSelectedServiceProvider(value));
  };

  if (!serviceProviders || serviceProviders.length === 0) {
    return <div>No service providers available.</div>;
  }

  return (
    <div>
      <label htmlFor="serviceProviderSelect">Service Provider</label>
      <select
        id="serviceProviderSelect"
        value={selectedServiceProviderId || ""}
        onChange={handleChange}
        style={{ marginLeft: "8px", padding: "6px" }}
      >
        {serviceProviders.map((sp) => (
          <option key={sp.id} value={sp.id}>
            {sp.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ServiceProviderSelect;
