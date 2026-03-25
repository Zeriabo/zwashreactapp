import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const getOpeningHours = async (stationId) => {
  const response = await axios.get(
    `${API_BASE_URL}:8080/v1/stations/${stationId}/opening-hours`
  );
  return response.data || [];
};

export const saveOpeningHours = async (stationId, hours) => {
  const response = await axios.put(
    `${API_BASE_URL}:8080/v1/stations/${stationId}/opening-hours`,
    hours
  );
  return response.data || [];
};
