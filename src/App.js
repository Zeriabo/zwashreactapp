import "./App.css";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Home from "./pages/Home";
function App() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Home />
      </Box>
    </Container>
  );
}

export default App;
