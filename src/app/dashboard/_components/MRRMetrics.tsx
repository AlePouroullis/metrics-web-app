// components/MRRMetrics.js
import React from "react";
import { Typography, Box, Paper } from "@mui/material";

type MRRMetricsProps = {
  currentMRR: number;
  churnedMRR: number;
  netNewMRR: number;
  mrrGrowthRate: number;
};

const MRRMetrics = ({
  currentMRR,
  churnedMRR,
  netNewMRR,
  mrrGrowthRate,
}: MRRMetricsProps) => {
  return (
    <Paper elevation={3} sx={{ p: 2, marginBottom: 2 }}>
      <Typography variant="h6">MRR Metrics</Typography>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", marginTop: 1 }}
      >
        <Typography>Current MRR: ${currentMRR}</Typography>
        <Typography>Churned MRR: ${churnedMRR}</Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography>Net New MRR: ${netNewMRR}</Typography>
        <Typography>MRR Growth Rate: {mrrGrowthRate}%</Typography>
      </Box>
    </Paper>
  );
};

export default MRRMetrics;
