import React, { useState } from "react";
import { TextField, Button, Paper, Typography, Box } from "@mui/material";

export default function MetricPrompt() {
  const [metricName, setMetricName] = useState("");
  const [metricValue, setMetricValue] = useState("");

  // Dummy function to simulate fetching metric data
  const fetchMetric = (name: string) => {
    // In a real app, you'd make an API request here based on the requested metric name
    // For demonstration, we're returning a hardcoded value
    if (name === "Current MRR") return "$10,000";
    if (name === "Total Customers") return "120";
    return "Metric not found.";
  };

  const handleSubmit = () => {
    const value = fetchMetric(metricName);
    setMetricValue(value);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", my: 4 }}>
      <TextField
        fullWidth
        label="Enter Metric Name"
        value={metricName}
        onChange={(e) => setMetricName(e.target.value)}
        variant="outlined"
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ display: "block", mx: "auto", mb: 2 }}
      >
        Get Metric
      </Button>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography>{metricValue}</Typography>
      </Paper>
    </Box>
  );
}
