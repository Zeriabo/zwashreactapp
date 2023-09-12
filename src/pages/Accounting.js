import React from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Container, Grid } from "@mui/material";
import {
  Button,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
const Accounting = () => {
  const { stationId } = useParams();
  const navigate = useNavigate();
  const station = useSelector((state) => {
    return state.station.stations.find((s) => s.id === Number(stationId));
  });

  return (
    <div>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate(`/station/${stationId}`)} // Use navigate to specify the route you want to navigate to
      >
        Back
      </Button>

      <Container>
        {station && (
          <Card variant="outlined" style={{ margin: "20px" }}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Station Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6">Station Name:</Typography>
                  <Typography>{station.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6">Service Provider:</Typography>
                  <Typography>{station.serviceProvider.name}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">Service Provider User:</Typography>
                  <Typography>
                    {station.serviceProvider.serviceProviderUser.username}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default Accounting;
