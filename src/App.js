import "./App.css";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Home from "./pages/Home";
import SignIn from "./components/SignIn";
import Register from "./components/Register";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
function App() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Router>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/signin" component={SignIn} />
            <Route path="/register" component={Register} />
            <Route path="/dashboard" component={Dashboard} />
            {/* Redirect to the sign-in page if no route matches */}
            <Redirect to="/signin" />
          </Switch>
        </Router>
      </Box>
    </Container>
  );
}

export default App;
