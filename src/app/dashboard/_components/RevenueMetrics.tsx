// components/RevenueMetrics.js
import React from "react";
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

type RevenueMetricsProps = {
  netCashIn: number;
  revenuePerProduct: { name: string; revenue: number }[];
  netRevenueRetention: number;
};

const RevenueMetrics = ({
  netCashIn,
  revenuePerProduct,
  netRevenueRetention,
}: RevenueMetricsProps) => {
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6">Revenue Metrics</Typography>
      <Typography>Net Cash In From Subscriptions: ${netCashIn}</Typography>
      <Typography>Net Revenue Retention: {netRevenueRetention}%</Typography>

      <Typography variant="subtitle1" sx={{ mt: 1 }}>
        Revenue Per Product:
      </Typography>
      <TableContainer>
        <Table size="small" aria-label="revenue per product">
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell align="right">Revenue</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {revenuePerProduct.map((product, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {product.name}
                </TableCell>
                <TableCell align="right">${product.revenue}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default RevenueMetrics;
