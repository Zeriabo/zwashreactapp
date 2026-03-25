import "./App.css";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Home from "./pages/Home";
import SignIn from "./components/SignIn";
import Register from "./components/Register";
import Dashboard from "./pages/Dashboard";
import StationPage from "./pages/StationPage";
import Accounting from "./pages/Accounting";
import Profile from "./pages/Profile";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StationForm from "./pages/StationForm";
import ProgramDetail from "./components/ProgramDetail";
import AddProgram from "./components/AddProgram";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/create-station" element={<StationForm />} />
              <Route path="/station/:stationId" element={<StationPage />} />
              <Route path="/program/:id" element={<ProgramDetail />} />
              <Route path="/addProgram/:stationId" element={<AddProgram />} />
              <Route
                path="/station/accounting/:stationId"
                element={<Accounting />}
              />
            </Routes>
          </Router>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
