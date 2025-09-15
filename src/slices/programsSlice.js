import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { gql } from "@apollo/client";
import apolloClient from "../apollo";
const API_BASE_URL = process.env.REACT_APP_API_SERVER_URL;

const initialState = {
  programs: [],   
  loading: false,
  error: null,  
};


export const fetchProgramsForStation = createAsyncThunk(
  "programs/fetchProgramsForStation",
  async (stationId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE_URL}:8080/stations/washes?id=${stationId}`);
      if (!res.ok) throw new Error("Failed to fetch programs");

      const data = await res.json();

      const programs = data.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        duration: p.duration,
        programType: p.programType,
      }));

      return programs;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const addProgram = createAsyncThunk(
  "programs/addProgram",
  async ({ stationId, ...programData }, { rejectWithValue }) => {
    try {

      const response = await fetch(`${API_BASE_URL}:8080/stations/programs/${stationId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(programData),
      });

      if (!response.ok) {
        throw new Error("Failed to add a program");
      }


      const createdProgram = await response.json();
      return createdProgram;
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
        `${API_BASE_URL}/programs/${programId}`,
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
        `${API_BASE_URL}/programs/${programData.id}`, // Use the program's ID to identify the program to update
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
// delete a program
export const deleteProgram = createAsyncThunk(
  "programs/deleteProgram",
  async (programId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE_URL}:8080/programs/${programId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete program");
      return programId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)
// Slice
const programsSlice = createSlice({
  name: "programs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchProgramsForStation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgramsForStation.fulfilled, (state, action) => {
        state.loading = false;
        state.programs = action.payload;
      })
      .addCase(fetchProgramsForStation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add
      .addCase(addProgram.fulfilled, (state, action) => {
        state.programs.push(action.payload);
      })

      // Update
      .addCase(updateProgram.fulfilled, (state, action) => {
        const index = state.programs.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.programs[index] = action.payload;
      })

      // Delete
      .addCase(deleteProgram.fulfilled, (state, action) => {
        state.programs = state.programs.filter((p) => p.id !== action.payload);
      });
  },
});

export default programsSlice.reducer;
