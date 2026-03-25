import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Container, Grid } from "@mui/material";
import { Button, CircularProgress } from "@mui/material";
import { getStationDaily, getStationSummary } from "../services/analyticsService";

const formatMoney = (value) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(Number(value || 0));

const Accounting = () => {
  const { stationId } = useParams();
  const navigate = useNavigate();
  const station = useSelector((state) => {
    return state.station.stations.find((s) => s.id === Number(stationId));
  });

  const [loading, setLoading] = useState(false);
  const [daily, setDaily] = useState(null);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (!stationId) return;
      setLoading(true);
      try {
        const today = new Date().toISOString().slice(0, 10);
        const [dailyData, summaryData] = await Promise.all([
          getStationDaily(stationId, today),
          getStationSummary(stationId, 30),
        ]);
        setDaily(dailyData);
        setSummary(summaryData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [stationId]);

  const dailyMetrics = useMemo(() => {
    return {
      totalBookings: daily?.totalBookings ?? 0,
      totalRevenue: daily?.totalRevenue ?? 0,
      platformFeeTotal: daily?.platformFeeTotal ?? 0,
      providerRevenue: daily?.providerRevenue ?? 0,
    };
  }, [daily]);

  const summaryMetrics = useMemo(() => {
    return {
      totalBookings: summary?.totalBookings ?? 0,
      totalRevenue: summary?.totalRevenue ?? 0,
      platformFeeTotal: summary?.platformFeeTotal ?? 0,
      providerRevenue: summary?.providerRevenue ?? 0,
      windowDays: summary?.windowDays ?? 30,
    };
  }, [summary]);

  return (
    <div>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate(`/station/${stationId}`)}
      >
        Back
      </Button>

      <Container>
        {loading && <CircularProgress sx={{ mt: 2 }} />}
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

        <Grid container spacing={3} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" style={{ margin: "20px" }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Today&#39;s Sales
                </Typography>
                <Typography>Bookings: {dailyMetrics.totalBookings}</Typography>
                <Typography>
                  Total Revenue: {formatMoney(dailyMetrics.totalRevenue)}
                </Typography>
                <Typography>
                  Provider Revenue: {formatMoney(dailyMetrics.providerRevenue)}
                </Typography>
                <Typography color="text.secondary">
                  Platform Fees: {formatMoney(dailyMetrics.platformFeeTotal)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" style={{ margin: "20px" }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Last {summaryMetrics.windowDays} Days
                </Typography>
                <Typography>Bookings: {summaryMetrics.totalBookings}</Typography>
                <Typography>
                  Total Revenue: {formatMoney(summaryMetrics.totalRevenue)}
                </Typography>
                <Typography>
                  Provider Revenue: {formatMoney(summaryMetrics.providerRevenue)}
                </Typography>
                <Typography color="text.secondary">
                  Platform Fees: {formatMoney(summaryMetrics.platformFeeTotal)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Accounting;
