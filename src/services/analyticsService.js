import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const getTopStations = async (days = 30, limit = 5) => {
  const response = await axios.get(
    `${API_BASE_URL}:8080/v1/analytics/stations/top?days=${days}&limit=${limit}`
  );
  return response.data || [];
};

export const getTopPrograms = async (limit = 5, stationId) => {
  const query = stationId
    ? `limit=${limit}&stationId=${stationId}`
    : `limit=${limit}`;
  const response = await axios.get(
    `${API_BASE_URL}:8080/v1/analytics/programs/top?${query}`
  );
  return response.data || [];
};

export const getStationDaily = async (stationId, date) => {
  const query = date ? `?date=${date}` : "";
  const response = await axios.get(
    `${API_BASE_URL}:8080/v1/analytics/stations/${stationId}/daily${query}`
  );
  return response.data;
};

export const getStationSummary = async (stationId, days = 30) => {
  const response = await axios.get(
    `${API_BASE_URL}:8080/v1/analytics/stations/${stationId}/summary?days=${days}`
  );
  return response.data;
};
