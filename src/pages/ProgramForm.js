import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  createProgram, // Use this action to create a new program
  updateProgram, // Use this action to update an existing program
} from "../slices/programsSlice"; // Import your program-related actions

const ProgramForm = ({ stationId, program, onSubmit }) => {
  const [formData, setFormData] = useState(program);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Program Type:</label>
        <input
          type="text"
          name="programType"
          value={formData.programType}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Price:</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

const StationPrograms = () => {
  const { stationId } = useParams();
  const dispatch = useDispatch();
  const programs = useSelector((state) => state.programs.programs); // Assuming you have a slice for programs

  const handleProgramSubmit = (formData) => {
    // If program has an ID, it's an existing program; update it
    if (formData.id) {
      dispatch(updateProgram(formData)).then(() => {
        // Reload the list of programs after the update
        dispatch(fetchProgramsForStation(stationId));
      });
    } else {
      // Otherwise, it's a new program; create it
      dispatch(createProgram(stationId, formData)).then(() => {
        // Reload the list of programs after creation
        dispatch(fetchProgramsForStation(stationId));
      });
    }
  };

  useEffect(() => {
    // Fetch the list of programs associated with the station when the component mounts
    dispatch(fetchProgramsForStation(stationId));
  }, [dispatch, stationId]);

  return (
    <div>
      <h2>Programs for Station {stationId}</h2>
      <ul>
        {programs.map((program) => (
          <li key={program.id}>
            <ProgramForm
              stationId={stationId}
              program={program}
              onSubmit={handleProgramSubmit}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StationPrograms;
