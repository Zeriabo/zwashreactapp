import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { updateProgram, deleteProgram } from "../slices/programsSlice";

const ProgramDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const program = useSelector((state) => {
    return state.programs.programs.find((p) => Number(p.id) === Number(id));
  });
  const [prog, setProg] = useState(program);
  const [editMode, setEditMode] = useState(false); // Track edit mode
  const [editedProgram, setEditedProgram] = useState(program); // Store edited program data

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleSave = () => {
    // Handle save logic here (e.g., dispatch an action to update the program)
    // You can use the `editedProgram` state to get the updated data
    console.log("Program saved:", editedProgram);

    dispatch(updateProgram(editedProgram))
      .then(() => {
        // Handle success, e.g., show a success message
        console.log("Program updated successfully!");
      })
      .catch((error) => {
        // Handle error, e.g., show an error message
        console.error("Error updating program:", error);
      });

    toggleEditMode();
  };

  const handleDelete = () => {
    // Handle delete logic here (e.g., dispatch an action to delete the program)
    // You may want to show a confirmation dialog before deleting

    dispatch(deleteProgram(prog.id))
      .then((result) => {
        if (result.error) {
          console.error("Error deleting program:", result.error);
        } else {
          console.log(result);
        }
      })
      .catch((error) => {
        // Handle error, e.g., show an error message
        console.error("Error deleting program:", error);
      });
  };

  if (!program) {
    return <div>Program not found</div>;
  }

  return (
    <div>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate("/dashboard")} // Use navigate to specify the route you want to navigate to
      >
        Back
      </Button>
      <Paper elevation={3} style={{ padding: "16px" }}>
        <Typography variant="h4" gutterBottom>
          Program Details
        </Typography>

        <Typography variant="subtitle1">
          Program Type: {prog.programType}
        </Typography>

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
            Description: {prog.description}
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
          <Typography variant="body1">Price: {prog.price}</Typography>
        )}

        {/* Edit and Save buttons */}
        {editMode ? (
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              style={{ marginTop: "16px", marginRight: "8px" }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={toggleEditMode}
              style={{ marginTop: "16px" }}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={toggleEditMode}
            style={{ marginTop: "16px", marginRight: "8px" }}
          >
            Edit
          </Button>
        )}

        {/* Delete button */}
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          style={{ marginTop: "16px" }}
        >
          Delete
        </Button>

        <Button
          component={Link}
          to="/dashboard" // Adjust the path as needed
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
