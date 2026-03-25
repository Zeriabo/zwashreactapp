import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { addProgram } from "../slices/programsSlice";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const AddProgram = () => {
  const dispatch = useDispatch();
  const { stationId } = useParams();
  const [programType, setProgramType] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [brushType, setBrushType] = useState("");
  const [soapAmount, setSoapAmount] = useState("");
  const [waterPressure, setWaterPressure] = useState("");
  const navigate = useNavigate();
  const station = useSelector((state) => {
    return state.station.stations.find((s) => s.id === Number(stationId));
  });

  const handleProgramTypeChange = (e) => {
    setProgramType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Build the DTO expected by backend
    let newProgram = {
      stationId: Number(stationId),
      name,
      programType,
      description,
      price: parseFloat(price),
      brushType,
      soapAmount: soapAmount ? parseInt(soapAmount) : undefined,
      waterPressure: waterPressure ? parseInt(waterPressure) : undefined,
    };
    // Remove undefined fields
    Object.keys(newProgram).forEach(key => newProgram[key] === undefined && delete newProgram[key]);

    try {
      // Dispatch an action to create the program
      dispatch(addProgram({stationId, ...newProgram}));

      // Redirect to the program list or any other appropriate page
      //  navigate("/programs");
    } catch (error) {
      console.error("Error adding program:", error);
    }
  };

  // Conditional rendering of input fields based on the selected program type
  let inputFields;
  if (programType === "HIGH_PRESSURE") {
    inputFields = (
      <div>
        <TextField
          label="Water Pressure"
          variant="outlined"
          fullWidth
          required
          type="number"
          value={waterPressure}
          onChange={(e) => setWaterPressure(e.target.value)}
        />
      </div>
    );
  } else if (programType === "FOAM") {
    inputFields = (
      <div>
        <TextField
          label="Water Pressure"
          variant="outlined"
          fullWidth
          required
          type="number"
          value={waterPressure}
          onChange={(e) => setWaterPressure(e.target.value)}
        />
        <TextField
          label="Soap Amount"
          variant="outlined"
          fullWidth
          required
          type="number"
          value={soapAmount}
          onChange={(e) => setSoapAmount(e.target.value)}
        />
        <TextField
          label="Brush Type"
          variant="outlined"
          fullWidth
          required
          value={brushType}
          onChange={(e) => setBrushType(e.target.value)}
        />
      </div>
    );
  } else if (programType === "TOUCH_LESS") {
    inputFields = (
      <div>
        <TextField
          label="Water Pressure"
          variant="outlined"
          fullWidth
          required
          type="number"
          value={waterPressure}
          onChange={(e) => setWaterPressure(e.target.value)}
        />
        <TextField
          label="Soap Amount"
          variant="outlined"
          fullWidth
          required
          type="number"
          value={soapAmount}
          onChange={(e) => setSoapAmount(e.target.value)}
        />
      </div>
    );
  }

  return (
    <div>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate(`/station/${stationId}`)} // Use navigate to specify the route you want to navigate to
      >
        Back
      </Button>
      <Paper elevation={3} style={{ padding: "16px" }}>
        <Typography variant="h4" gutterBottom>
          Add a New Program
        </Typography>
        <label>Select the wash type</label>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Program Name"
            variant="outlined"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Select
            value={programType}
            onChange={handleProgramTypeChange}
            label="Program Type"
            required
          >
            <MenuItem value="highpressure">High Pressure</MenuItem>
            <MenuItem value="foam">Foam</MenuItem>
            <MenuItem value="touchless">Touch-less</MenuItem>
          </Select>

          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            required
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <TextField
            label="Price"
            variant="outlined"
            fullWidth
            required
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          {inputFields}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: "16px" }}
          >
            Add Program
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default AddProgram;
