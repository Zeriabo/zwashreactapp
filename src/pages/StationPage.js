import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom"; // Import useParams to access route parameters

import MapPicker from "react-google-map-picker";
const StationPage = () => {
  const { stationId } = useParams();
  const station = useSelector((state) => {
    return state.station.stations.find((s) => s.id === Number(stationId));
  });
  const DefaultLocation = { lat: station.latitude, lng: station.longitude };
  if (!station) {
    return <div>Station not found</div>;
  }
  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };
  const handleChangeLocation = (lat, lng) => {
    console.log(lat, lng);
    const updatedLocation = {
      lat: lat !== undefined ? lat : DefaultLocation.lat,
      lng: lng !== undefined ? lng : DefaultLocation.lng,
    };
    console.log(updatedLocation);
  };
  return (
    <div>
      <h2>Station Details</h2>
      <p>Name: {station.name}</p>
      <p>Address: {station.address}</p>

      <MapPicker
        mapContainerStyle={mapContainerStyle}
        defaultLocation={DefaultLocation}
        zoom={13} // Adjust zoom level as needed
        mapTypeId="roadmap"
        style={{ height: "400px", marginTop: "20px" }}
        onChangeLocation={handleChangeLocation}
        apiKey="AIzaSyDLSwn-vtm6HJwMuAM_iflsezLRB1BkPyA"
      />
    </div>
  );
};

export default StationPage;
