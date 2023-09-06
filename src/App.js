import "./App.css";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Home from "./pages/Home";
import SignIn from "./components/SignIn";
import Register from "./components/Register";
import Dashboard from "./pages/Dashboard";
import StationPage from "./pages/StationPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StationForm from "./pages/StationForm";

function App() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-station" element={<StationForm />} />
            <Route path="/station/:stationId" element={<StationPage />} />
          </Routes>
        </Router>
      </Box>
    </Container>
  );
}

export default App;
