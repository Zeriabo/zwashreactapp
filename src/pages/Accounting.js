import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Card, CardContent, Typography, Container, Grid } from "@mui/material";

const Accounting = () => {
  const { stationId } = useParams();
  const station = useSelector((state) => {
    return state.station.stations.find((s) => s.id === Number(stationId));
  });

  return (
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
  );
};

export default Accounting;
