import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const ProgramDetail = () => {
  const { id } = useParams();
  const program = useSelector((state) => {
    return state.programs.programs.find((p) => Number(p.id) === Number(id));
  });

  const [editMode, setEditMode] = useState(false); // Track edit mode
  const [editedProgram, setEditedProgram] = useState(program); // Store edited program data

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleSave = () => {
    // Handle save logic here (e.g., dispatch an action to update the program)
    // You can use the `editedProgram` state to get the updated data
    console.log("Program saved:", editedProgram);
    // After saving, exit edit mode
    toggleEditMode();
  };

  if (!program) {
    return <div>Program not found</div>;
  }

  return (
    <div>
      <Paper elevation={3} style={{ padding: "16px" }}>
        <Typography variant="h4" gutterBottom>
          Program Details
        </Typography>
        {editMode ? (
          <div>
            <label htmlFor="programType">Program Type:</label>
            <input
              type="text"
              id="programType"
              value={editedProgram.programType}
              onChange={(e) =>
                setEditedProgram({
                  ...editedProgram,
                  programType: e.target.value,
                })
              }
            />
          </div>
        ) : (
          <Typography variant="subtitle1">
            Program Type: {program.programType}
          </Typography>
        )}

        {editMode ? (
          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={editedProgram.description}
              onChange={(e) =>
                setEditedProgram({
                  ...editedProgram,
                  description: e.target.value,
                })
              }
            />
          </div>
        ) : (
          <Typography variant="body1" paragraph>
            Description: {program.description}
          </Typography>
        )}

        {editMode ? (
          <div>
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              value={editedProgram.price}
              onChange={(e) =>
                setEditedProgram({
                  ...editedProgram,
                  price: parseFloat(e.target.value),
                })
              }
            />
          </div>
        ) : (
          <Typography variant="body1">Price: {program.price}</Typography>
        )}

        {/* Edit and Save buttons */}
        {editMode ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            style={{ marginTop: "16px" }}
          >
            Save
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={toggleEditMode}
            style={{ marginTop: "16px" }}
          >
            Edit
          </Button>
        )}

        <Button
          component={Link}
          to={"/dashboard"} // Adjust the path as needed
          variant="contained"
          color="primary"
          style={{ marginTop: "16px", marginLeft: "8px" }}
        >
          Back
        </Button>
      </Paper>
    </div>
  );
};

export default ProgramDetail;
