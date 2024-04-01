// components/CustomerMetrics.js
import React from "react";
import {
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

type CustomerMetricsProps = {
  totalCustomers: number;
  newCustomers: number;
  churnedCustomers: string[];
  upcomingRenewals: { name: string; mrr: number }[];
};

const CustomerMetrics = ({
  totalCustomers,
  newCustomers,
  churnedCustomers,
  upcomingRenewals,
}: CustomerMetricsProps) => {
  return (
    <Paper elevation={3} sx={{ p: 2, marginBottom: 2 }}>
      <Typography variant="h6">Customer Metrics</Typography>
      <Typography>Total Customers: {totalCustomers}</Typography>
      <Typography>New Customers: {newCustomers}</Typography>

      <Typography variant="subtitle1" sx={{ mt: 1 }}>
        Churned Customers:
      </Typography>
      <List>
        {churnedCustomers.map((customer, index) => (
          <ListItem key={index} sx={{ py: 0 }}>
            <ListItemText primary={customer} />
          </ListItem>
        ))}
      </List>

      <Typography variant="subtitle1">Upcoming Renewals:</Typography>
      <List>
        {upcomingRenewals.map((renewal, index) => (
          <ListItem key={index} sx={{ py: 0 }}>
            <ListItemText primary={`${renewal.name} - ${renewal.mrr}`} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default CustomerMetrics;
