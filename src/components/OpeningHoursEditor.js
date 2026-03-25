import React, { useEffect, useState } from "react";
import { Paper, Typography, Grid, TextField, Switch, Button, Divider } from "@mui/material";
import { getOpeningHours, saveOpeningHours } from "../services/openingHoursService";

const DAYS = [
  { label: "Monday", value: "MONDAY" },
  { label: "Tuesday", value: "TUESDAY" },
  { label: "Wednesday", value: "WEDNESDAY" },
  { label: "Thursday", value: "THURSDAY" },
  { label: "Friday", value: "FRIDAY" },
  { label: "Saturday", value: "SATURDAY" },
  { label: "Sunday", value: "SUNDAY" },
];

const buildDefault = () =>
  DAYS.map((day) => ({
    dayOfWeek: day.value,
    openTime: "09:00",
    closeTime: "18:00",
    closed: false,
  }));

const OpeningHoursEditor = ({ stationId }) => {
  const [rows, setRows] = useState(buildDefault());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!stationId) return;
      setLoading(true);
      try {
        const data = await getOpeningHours(stationId);
        if (Array.isArray(data) && data.length > 0) {
          const map = new Map(data.map((row) => [row.dayOfWeek, row]));
          setRows(
            DAYS.map((day) => ({
              dayOfWeek: day.value,
              openTime: map.get(day.value)?.openTime || "09:00",
              closeTime: map.get(day.value)?.closeTime || "18:00",
              closed: map.get(day.value)?.closed ?? false,
            }))
          );
        } else {
          setRows(buildDefault());
        }
      } catch (err) {
        setRows(buildDefault());
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [stationId]);

  const handleChange = (index, field, value) => {
    setRows((prev) =>
      prev.map((row, idx) =>
        idx === index ? { ...row, [field]: value } : row
      )
    );
  };

  const handleSave = async () => {
    if (!stationId) return;
    setSaving(true);
    try {
      await saveOpeningHours(stationId, rows);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }} elevation={2}>
      <Typography variant="h6" gutterBottom>
        Opening Hours
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {loading ? (
        <Typography>Loading hours...</Typography>
      ) : (
        <Grid container spacing={2}>
          {rows.map((row, index) => {
            const label = DAYS.find((d) => d.value === row.dayOfWeek)?.label || row.dayOfWeek;
            return (
              <React.Fragment key={row.dayOfWeek}>
                <Grid item xs={12} sm={3}>
                  <Typography sx={{ mt: 1 }}>{label}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    type="time"
                    label="Open"
                    value={row.openTime || ""}
                    disabled={row.closed}
                    onChange={(e) => handleChange(index, "openTime", e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    type="time"
                    label="Close"
                    value={row.closeTime || ""}
                    disabled={row.closed}
                    onChange={(e) => handleChange(index, "closeTime", e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography component="div" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    Closed
                    <Switch
                      checked={row.closed}
                      onChange={(e) => handleChange(index, "closed", e.target.checked)}
                    />
                  </Typography>
                </Grid>
              </React.Fragment>
            );
          })}
        </Grid>
      )}
      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save Hours"}
      </Button>
    </Paper>
  );
};

export default OpeningHoursEditor;
