import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { gql } from "@apollo/client";
import apolloClient from "../apollo";
// Define an initial state for the programs slice
const initialState = {
  programs: [], // Store the list of car washing programs
  loading: false,
  error: null,
};
const GET_PROGRAMS_FOR_STATION = gql`
  query GetStationPrograms($stationId: ID!) {
    getStationPrograms(stationId: $stationId) {
      id
      programType
      description
      price
    }
  }
`;
// Define an async thunk to fetch car washing programs for a station
export const fetchProgramsForStation = createAsyncThunk(
  "programs/fetchProgramsForStation",
  async (stationId, { rejectWithValue }) => {
    try {
      // Use Apollo Client to send the GraphQL query
      const response = await apolloClient.query({
        query: GET_PROGRAMS_FOR_STATION,
        variables: { stationId },
      });

      // Check for errors in the GraphQL response
      if (response.errors) {
        throw new Error("GraphQL query error");
      }
      // Extract the programs from the response data
      const programs = response.data;

      return programs;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Define an async thunk to add a new car washing program
export const addProgram = createAsyncThunk(
  "programs/addProgram",
  async (programData, { rejectWithValue }) => {
    try {
      // Make an API request to add a new car washing program
      const response = await fetch("http://localhost:7001/v1/programs/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(programData),
      });
      if (!response.ok) {
        throw new Error("Failed to add a program");
      }
      return programData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Define an async thunk to remove a car washing program
export const removeProgram = createAsyncThunk(
  "programs/removeProgram",
  async (programId, { rejectWithValue }) => {
    try {
      // Make an API request to remove the car washing program with the specified programId
      const response = await fetch(
        `http://localhost:7001/v1/programs/${programId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to remove the program");
      }
      return programId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// update a program
export const updateProgram = createAsyncThunk(
  "programs/updateProgram",
  async (programData, { rejectWithValue }) => {
    try {
      // Make an API request to update an existing car washing program
      const response = await fetch(
        `http://localhost:7001/v1/programs/${programData.id}`, // Use the program's ID to identify the program to update
        {
          method: "PUT", // Use the PUT method for updates
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(programData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update the program");
      }

      // Return the updated program data
      return programData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create a slice for the programs
const programsSlice = createSlice({
  name: "programs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProgramsForStation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgramsForStation.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.programs = action.payload.getStationPrograms;
      })
      .addCase(fetchProgramsForStation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addProgram.fulfilled, (state, action) => {
        state.programs.push(action.payload);
      })
      .addCase(removeProgram.fulfilled, (state, action) => {
        state.programs = state.programs.filter(
          (program) => program.id !== action.payload
        );
      })
      .addCase(updateProgram.fulfilled, (state, action) => {
        // Find the index of the updated program in the programs array
        const updatedProgramIndex = state.programs.findIndex(
          (program) => program.id === action.payload.id
        );

        // Update the program in the programs array with the updated data
        if (updatedProgramIndex !== -1) {
          state.programs[updatedProgramIndex] = action.payload;
        }
      });
  },
});

export default programsSlice.reducer;
