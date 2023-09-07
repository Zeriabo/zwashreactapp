import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import MapPicker from "react-google-map-picker";
import { updateStationAddress } from "../slices/stationsSlice"; // Import the action for updating the address
import { useDispatch } from "react-redux";
import { fetchProgramsForStation } from "../slices/programsSlice";
import ProgramList from "../components/ProgramList";
const StationPage = () => {
  const { stationId } = useParams();
  const station = useSelector((state) => {
    return state.station.stations.find((s) => s.id === Number(stationId));
  });
  useEffect(() => {
    dispatch(fetchProgramsForStation(stationId));
  }, [stationId]);
  const DefaultLocation = {
    lat: station.latitude,
    lng: station.longitude,
  };
  const programs = useSelector((state) => {
    return state.programs.programs;
  });

  console.log(programs);
  const [newAddress, setNewAddress] = useState(""); // State for the new address
  const dispatch = useDispatch(); // Redux dispatch function

  if (!station) {
    return <div>Station not found</div>;
  }

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const handleChangeLocation = (lat, lng) => {
    // Handle location change here
    const updatedLocation = {
      lat: lat !== undefined ? lat : DefaultLocation.lat,
      lng: lng !== undefined ? lng : DefaultLocation.lng,
    };
    // Create a copy of the station object with updated latitude and longitude
    const updatedStation = {
      ...station,
      latitude: updatedLocation.lat,
      longitude: updatedLocation.lng,
    };
    // need to update the station in the store with this id to those lat and lng
    // station.latitude = updatedLocation.lat;
    // station.longitude = updatedLocation.lng;
    handleUpdateAddress(updatedStation);
  };

  const handleUpdateAddress = (updatedStation) => {
    updatedStation.address = newAddress;

    dispatch(updateStationAddress(stationId, updatedStation));
    // Optionally, you can clear the input field or show a success message
    setNewAddress("");
  };

  return (
    <div>
      <h2>Station Details</h2>
      <p>Name: {station.name}</p>
      <p>Address: {station.address}</p>

      {/* Input field for the new address */}
      <div>
        <label htmlFor="newAddress">New Address:</label>
        <input
          type="text"
          id="newAddress"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
        />
      </div>

      {/* Button to update the address */}
      <button onClick={handleUpdateAddress}>Update Address</button>
      {/* {programs.map((program) => (
        <div key={program.id}>
          <p>Program Type: {program.programType}</p>
          <p>Description: {program.description}</p>
          <p>Price: {program.price}</p>
        </div>
      ))} */}
      <ProgramList programs={programs} />
      <MapPicker
        mapContainerStyle={mapContainerStyle}
        defaultLocation={DefaultLocation}
        zoom={13}
        mapTypeId="roadmap"
        style={{ height: "400px", marginTop: "20px" }}
        onChangeLocation={handleChangeLocation}
        apiKey="AIzaSyDLSwn-vtm6HJwMuAM_iflsezLRB1BkPyA"
      />
    </div>
  );
};

export default StationPage;
