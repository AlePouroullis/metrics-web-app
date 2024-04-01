import React, { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

export default function MetricPrompt() {
  const [input, setInput] = useState("");
  const [metricValue, setMetricValue] = useState("");
  const [loadingResponse, setLoadingResponse] = useState(false);

  // Dummy function to simulate fetching metric data
  const fetchMetric = async () => {
    // In a real app, you'd make an API request here based on the requested metric name
    // For demonstration, we're returning a hardcoded value
    // simulate delay
    setLoadingResponse(true);

    const response = await fetch(`/api/fetch-metrics?input=${input}`);
    const data = await response.json();

    setMetricValue(JSON.stringify(data));
    setLoadingResponse(false);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", my: 4 }}>
      <TextField
        fullWidth
        label="Enter Metric Name"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        variant="outlined"
        margin="normal"
        multiline // Enables multi-line input
        minRows={4} // Minimum number of rows the textarea will occupy
      />
      <Button
        variant="contained"
        color="primary"
        onClick={fetchMetric}
        sx={{ display: "block", mx: "auto", mb: 2 }}
      >
        Get Metric
      </Button>
      <Paper elevation={3} sx={{ p: 2 }}>
        {loadingResponse ? (
          <CircularProgress />
        ) : (
          <Typography>{metricValue}</Typography>
        )}
      </Paper>
    </Box>
  );
}
