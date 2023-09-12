import React from "react";
import { Link } from "react-router-dom";

const ProgramList = ({ programs, stationId }) => {
  return (
    <div>
      <h2>Car Washing Programs</h2>
      <ul>
        {programs.map((program) => (
          <li key={program.id}>
            <Link to={`/program/${program.id}?stationId=${stationId}`}>
              <p>Program Type: {program.programType}</p>
              <p>Description: {program.description}</p>
              <p>Price: {program.price}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProgramList;
