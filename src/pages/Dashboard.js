import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, logOut } from "../slices/userSlice";
import { fetchStations } from "../slices/stationsSlice";
import { Link, useNavigate } from "react-router-dom";
import ServiceProviderSelect from "../components/ServiceProviderSelect";
import {
  ThemeProvider,
  createTheme,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Paper,
  Divider,
  Grid,
  LinearProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import BarChartIcon from "@mui/icons-material/BarChart";
import PersonIcon from "@mui/icons-material/Person";
import { getStationDaily, getTopPrograms } from "../services/analyticsService";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#ff5722" },
  },
});

const formatMoney = (value) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(Number(value || 0));

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userstate = useSelector(selectUser);
  const stations = useSelector((state) => state.station?.stations || []);
  const selectedServiceProviderId = useSelector(
    (state) => state.serviceProviders?.selectedServiceProviderId || null
  );

  const [dailyMetrics, setDailyMetrics] = useState({});
  const [topPrograms, setTopPrograms] = useState({});
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [programsLoading, setProgramsLoading] = useState(false);

  useEffect(() => {
    if (selectedServiceProviderId !== null) {
      dispatch(fetchStations(selectedServiceProviderId));
    }
  }, [dispatch, selectedServiceProviderId]);

  useEffect(() => {
    const loadMetrics = async () => {
      if (!stations || stations.length === 0) {
        setDailyMetrics({});
        return;
      }
      setMetricsLoading(true);
      try {
        const today = new Date().toISOString().slice(0, 10);
        const entries = await Promise.all(
          stations.map(async (station) => {
            try {
              const data = await getStationDaily(station.id, today);
              return [station.id, data];
            } catch (err) {
              return [station.id, null];
            }
          })
        );
        const next = {};
        entries.forEach(([id, data]) => {
          next[id] = data;
        });
        setDailyMetrics(next);
      } finally {
        setMetricsLoading(false);
      }
    };

    loadMetrics();
  }, [stations]);

  useEffect(() => {
    const loadTopPrograms = async () => {
      if (!stations || stations.length === 0) {
        setTopPrograms({});
        return;
      }
      setProgramsLoading(true);
      try {
        const entries = await Promise.all(
          stations.map(async (station) => {
            try {
              const data = await getTopPrograms(1, station.id);
              return [station.id, data && data.length > 0 ? data[0] : null];
            } catch (err) {
              return [station.id, null];
            }
          })
        );
        const next = {};
        entries.forEach(([id, data]) => {
          next[id] = data;
        });
        setTopPrograms(next);
      } finally {
        setProgramsLoading(false);
      }
    };

    loadTopPrograms();
  }, [stations]);

  const stationsWithMetrics = useMemo(() => {
    return stations
      .map((station) => {
        const metrics = dailyMetrics[station.id] || {};
        const totalRevenue = metrics?.totalRevenue ?? 0;
        return { ...station, metrics, totalRevenue };
      })
      .sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [stations, dailyMetrics]);

  const totals = useMemo(() => {
    return stationsWithMetrics.reduce(
      (acc, station) => {
        const metrics = station.metrics || {};
        acc.totalBookings += metrics.totalBookings ?? 0;
        acc.totalRevenue += metrics.totalRevenue ?? 0;
        acc.providerRevenue += metrics.providerRevenue ?? 0;
        acc.platformFeeTotal += metrics.platformFeeTotal ?? 0;
        return acc;
      },
      { totalBookings: 0, totalRevenue: 0, providerRevenue: 0, platformFeeTotal: 0 }
    );
  }, [stationsWithMetrics]);

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/");
  };

  const handleEditStation = (stationId) => {
    navigate(`/station/${stationId}`);
  };

  const handleAccounting = (stationId) => {
    navigate(`/station/accounting/${stationId}`);
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  if (userstate.loading) return <Typography>Loading...</Typography>;
  if (!userstate.user) {
    navigate("/");
    return null;
  }

  const { username } = userstate.user;

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          p: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4">Welcome, {username || "Guest"}!</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" onClick={handleProfile} startIcon={<PersonIcon />}>
              Profile & Payouts
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <ServiceProviderSelect />
        </Box>

        <Paper sx={{ p: 2, mb: 4 }} elevation={3}>
          <Typography variant="h5" gutterBottom>
            Total Earnings (Today)
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {metricsLoading && <LinearProgress sx={{ mb: 2 }} />}
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Typography>Bookings</Typography>
              <Typography variant="h6">{totals.totalBookings}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography>Total Revenue</Typography>
              <Typography variant="h6">{formatMoney(totals.totalRevenue)}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography>Provider Revenue</Typography>
              <Typography variant="h6">{formatMoney(totals.providerRevenue)}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography>Platform Fees</Typography>
              <Typography variant="h6">{formatMoney(totals.platformFeeTotal)}</Typography>
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 2, mb: 4 }} elevation={3}>
          <Typography variant="h5" gutterBottom>
            Today&#39;s Sales
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {metricsLoading && <LinearProgress sx={{ mb: 2 }} />}
          {stationsWithMetrics.length > 0 ? (
            <Grid container spacing={2}>
              {stationsWithMetrics.map((station) => {
                const metrics = station.metrics || {};
                return (
                  <Grid item xs={12} md={6} key={station.id}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1">{station.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {station.address}
                      </Typography>
                      <Typography sx={{ mt: 1 }}>
                        Bookings: {metrics.totalBookings ?? 0}
                      </Typography>
                      <Typography>
                        Total Revenue: {formatMoney(metrics.totalRevenue)}
                      </Typography>
                      <Typography>
                        Provider Revenue: {formatMoney(metrics.providerRevenue)}
                      </Typography>
                      <Typography color="text.secondary">
                        Platform Fees: {formatMoney(metrics.platformFeeTotal)}
                      </Typography>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Typography>No stations available.</Typography>
          )}
        </Paper>

        <Paper sx={{ p: 2, mb: 4 }} elevation={3}>
          <Typography variant="h5" gutterBottom>
            Stations
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {metricsLoading && <LinearProgress sx={{ mb: 2 }} />}
          {programsLoading && <LinearProgress sx={{ mb: 2 }} />}
          {stationsWithMetrics.length > 0 ? (
            <List>
              {stationsWithMetrics.map((station) => {
                const metrics = station.metrics || {};
                const metricsLine = `Today: ${formatMoney(
                  metrics.totalRevenue
                )} • Bookings ${metrics.totalBookings ?? 0}`;
                const topProgram = topPrograms[station.id];
                const topProgramLine = topProgram
                  ? `Top program: ${topProgram.programName} (${topProgram.totalBookings})`
                  : "Top program: n/a";
                return (
                  <ListItem
                    key={station.id}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      bgcolor: "#f5f5f5",
                    }}
                    secondaryAction={
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          edge="end"
                          color="primary"
                          onClick={() => handleAccounting(station.id)}
                        >
                          <BarChartIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          color="primary"
                          onClick={() => handleEditStation(station.id)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={station.name}
                      secondary={`${station.address} • ${metricsLine} • ${topProgramLine}`}
                    />
                  </ListItem>
                );
              })}
            </List>
          ) : (
            <Typography>No stations available.</Typography>
          )}
        </Paper>

        <Box textAlign="center">
          <Link to="/create-station" style={{ textDecoration: "none" }}>
            <Button variant="contained" color="primary" size="large">
              Create Station
            </Button>
          </Link>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
