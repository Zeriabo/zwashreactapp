import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { getStationDaily, getStationSummary } from "../services/analyticsService";
import { updateStripeAccountId } from "../services/ServiceProviderService";

const formatMoney = (value) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(Number(value || 0));

const sumMetrics = (rows) =>
  rows.reduce(
    (acc, row) => ({
      totalBookings: acc.totalBookings + (row?.totalBookings ?? 0),
      totalRevenue: acc.totalRevenue + (row?.totalRevenue ?? 0),
      platformFeeTotal: acc.platformFeeTotal + (row?.platformFeeTotal ?? 0),
      providerRevenue: acc.providerRevenue + (row?.providerRevenue ?? 0),
    }),
    { totalBookings: 0, totalRevenue: 0, platformFeeTotal: 0, providerRevenue: 0 }
  );

const Profile = () => {
  const navigate = useNavigate();
  const providers = useSelector((state) => state.serviceProviders?.list || []);
  const selectedServiceProviderId = useSelector(
    (state) => state.serviceProviders?.selectedServiceProviderId || null
  );
  const stations = useSelector((state) => state.station?.stations || []);

  const provider = useMemo(() => {
    return providers.find((sp) => sp.id === selectedServiceProviderId) || null;
  }, [providers, selectedServiceProviderId]);

  const [stripeAccountId, setStripeAccountId] = useState("");
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(false);
  const [dailyTotals, setDailyTotals] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    platformFeeTotal: 0,
    providerRevenue: 0,
  });
  const [summaryTotals, setSummaryTotals] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    platformFeeTotal: 0,
    providerRevenue: 0,
    windowDays: 30,
  });

  useEffect(() => {
    setStripeAccountId(provider?.stripeAccountId || "");
  }, [provider?.stripeAccountId]);

  useEffect(() => {
    const load = async () => {
      if (!stations || stations.length === 0) {
        setDailyTotals({ totalBookings: 0, totalRevenue: 0, platformFeeTotal: 0, providerRevenue: 0 });
        setSummaryTotals({ totalBookings: 0, totalRevenue: 0, platformFeeTotal: 0, providerRevenue: 0, windowDays: 30 });
        return;
      }
      setLoading(true);
      try {
        const today = new Date().toISOString().slice(0, 10);
        const dailyRows = await Promise.all(
          stations.map((station) => getStationDaily(station.id, today).catch(() => null))
        );
        const summaryRows = await Promise.all(
          stations.map((station) => getStationSummary(station.id, 30).catch(() => null))
        );
        setDailyTotals(sumMetrics(dailyRows.filter(Boolean)));
        const summary = sumMetrics(summaryRows.filter(Boolean));
        setSummaryTotals({ ...summary, windowDays: 30 });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [stations]);

  const handleSaveStripe = async () => {
    if (!provider) return;
    setSaving(true);
    try {
      await updateStripeAccountId(provider.id, stripeAccountId);
      setSnackbar({ open: true, message: "Stripe account saved", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to save Stripe account", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
      <Button variant="outlined" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </Button>

      <Paper sx={{ p: 3, mt: 3 }} elevation={3}>
        <Typography variant="h5" gutterBottom>
          Provider Profile
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {provider ? (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">Business Name</Typography>
              <Typography>{provider.name}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">Email</Typography>
              <Typography>{provider.email}</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                label="Stripe Connected Account ID"
                value={stripeAccountId}
                onChange={(e) => setStripeAccountId(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: "flex", alignItems: "center" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveStripe}
                disabled={saving}
                fullWidth
              >
                {saving ? "Saving..." : "Save Stripe Account"}
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Typography>No provider selected.</Typography>
        )}
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }} elevation={3}>
        <Typography variant="h5" gutterBottom>
          Payouts & Earnings
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {loading && <CircularProgress sx={{ mb: 2 }} />}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">Today</Typography>
                <Typography>Bookings: {dailyTotals.totalBookings}</Typography>
                <Typography>Total Revenue: {formatMoney(dailyTotals.totalRevenue)}</Typography>
                <Typography>Provider Revenue: {formatMoney(dailyTotals.providerRevenue)}</Typography>
                <Typography color="text.secondary">Platform Fees: {formatMoney(dailyTotals.platformFeeTotal)}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">Last {summaryTotals.windowDays} Days</Typography>
                <Typography>Bookings: {summaryTotals.totalBookings}</Typography>
                <Typography>Total Revenue: {formatMoney(summaryTotals.totalRevenue)}</Typography>
                <Typography>Provider Revenue: {formatMoney(summaryTotals.providerRevenue)}</Typography>
                <Typography color="text.secondary">Platform Fees: {formatMoney(summaryTotals.platformFeeTotal)}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
