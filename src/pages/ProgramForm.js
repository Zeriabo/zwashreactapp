import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  createProgram,
  updateProgram,
  deleteProgram, // import delete action
  fetchProgramsForStation,
} from "../slices/programsSlice";

const ProgramForm = ({ stationId, program, onSubmit, onDelete }) => {
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

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this program?")) {
      onDelete(program.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
      <div>
        <label>Program Type:</label>
        <input
          type="text"
          name="programType"
          value={formData.programType || ""}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Price:</label>
        <input
          type="number"
          name="price"
          value={formData.price || 0}
          onChange={handleInputChange}
        />
      </div>
      <button type="submit">Save</button>
      {program.id && <button type="button" onClick={handleDelete} style={{ marginLeft: "10px" }}>Delete</button>}
    </form>
  );
};

const StationPrograms = () => {
  const { stationId } = useParams();
  const dispatch = useDispatch();
  const programs = useSelector((state) => state.programs.programs);

  const handleProgramSubmit = (formData) => {
    if (formData.id) {
      dispatch(updateProgram(formData)).then(() => {
        dispatch(fetchProgramsForStation(stationId));
      });
    } else {
      dispatch(createProgram({ stationId, ...formData })).then(() => {
        dispatch(fetchProgramsForStation(stationId));
      });
    }
  };

  const handleProgramDelete = (programId) => {
    dispatch(deleteProgram(programId)).then(() => {
      dispatch(fetchProgramsForStation(stationId));
    });
  };

  useEffect(() => {
    dispatch(fetchProgramsForStation(stationId));
  }, [dispatch, stationId]);

  return (
    <div>
      <h2>Programs for Station {stationId}</h2>
      {programs.length === 0 && <p>No programs available</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {programs.map((program) => (
          <li key={program.id}>
            <ProgramForm
              stationId={stationId}
              program={program}
              onSubmit={handleProgramSubmit}
              onDelete={handleProgramDelete} // pass delete handler
            />
          </li>
        ))}
      </ul>
      {/* Form to add a new program */}
      <h3>Add New Program</h3>
      <ProgramForm
        stationId={stationId}
        program={{ programType: "", description: "", price: 0 }}
        onSubmit={handleProgramSubmit}
        onDelete={() => {}}
      />
    </div>
  );
};

export default StationPrograms;
