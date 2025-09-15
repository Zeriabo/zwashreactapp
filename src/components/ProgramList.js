import React from "react";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import { CheckCircle, Delete } from "@mui/icons-material";

const ProgramList = ({ programs, onDeleteProgram }) => {
  return (
    <div>
      <h3>Programs</h3>
      {programs.length === 0 && <p>No programs available</p>}
      {programs.map((p) => (
        <div key={p.id} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
          <span>{p.programType} - {p.description} - ${p.price}</span>
          <IconButton onClick={() => onDeleteProgram(p.id)} color="error">
            <Delete />
          </IconButton>
        </div>
      ))}
    </div>
  );
};


export default ProgramList;
