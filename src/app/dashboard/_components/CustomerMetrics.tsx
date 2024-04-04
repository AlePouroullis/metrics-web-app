// components/CustomerMetrics.js
import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import MetricsGroupBase from "./MetricsGroupBase";
import metricBaseStyles from "./MetricsGroupBase.module.scss";
import { APIResponse, ChurnedCustomer, CustomerMetricsData } from "@/types";
import styles from "./CustomerMetrics.module.scss";

const CustomerMetrics = () => {
  const [customerMetrics, setCustomerMetrics] =
    useState<CustomerMetricsData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const response = await fetch("/api/metrics/customers");
      const json = (await response.json()) as APIResponse<CustomerMetricsData>;

      if (json.success) {
        setCustomerMetrics(json.data!);
      } else {
        console.error(json.error);
      }
      setLoading(false);
    })();
  }, []);

  const tableRowStyle = (index: number) => ({
    backgroundColor: index % 2 ? "#f5f5f5" : "#ffffff", // Alternate row colors
  });

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000); // Convert to milliseconds
    return date.toLocaleDateString(); // Format as you prefer
  };

  return (
    <MetricsGroupBase title="Customer Metrics">
      <div className={styles.content}>
        <div style={{ visibility: loading ? "hidden" : "visible" }}>
          <div className={metricBaseStyles.dataItem}>
            <span>Total Customers</span>{" "}
            <span>{customerMetrics?.total_customers}</span>
          </div>
          <div className={metricBaseStyles.separator} />
          <div className={metricBaseStyles.dataItem}>
            <span>New Customers</span>
            <span>{customerMetrics?.new_customers}</span>
          </div>
          <div className={metricBaseStyles.separator} />
          <div className={metricBaseStyles.dataItem}>
            <span>Churn Rate</span>
            <span>{customerMetrics?.churn_rate}%</span>
          </div>
          <div className={metricBaseStyles.separator} />
          <div className={styles.tableWrapper}>
            <h3 className={styles.tableHeader}>Churned Customers</h3>
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{ maxHeight: 200, overflow: "auto" }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                paddingLeft={2}
                paddingTop={2}
              >
                <Typography variant="subtitle1" fontSize={14}>
                  Showing {customerMetrics?.churned_customers.length || 0} items
                </Typography>
              </Box>
              <Table aria-label="churned customers table">
                <TableHead>
                  <TableRow>
                    <TableCell className={styles.headerCell}>
                      Customer Name
                    </TableCell>
                    <TableCell className={styles.headerCell} align="right">
                      Canceled At
                    </TableCell>
                    <TableCell className={styles.headerCell} align="right">
                      MRR
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customerMetrics &&
                  customerMetrics.churned_customers.length > 0 ? (
                    customerMetrics.churned_customers.map(
                      (customer: ChurnedCustomer, index) => (
                        <TableRow
                          key={customer.id}
                          sx={{
                            "&:nth-of-type(odd)": {
                              backgroundColor: "#f5f5f5",
                            },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {customer.name}
                          </TableCell>
                          <TableCell align="right">
                            {formatDate(customer.canceled_at)}
                          </TableCell>
                          <TableCell align="right">
                            ${(customer.mrr_cents / 100).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      )
                    )
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        align="center"
                        sx={{ color: "text.secondary", fontStyle: "italic" }}
                      >
                        None to show
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          <div className={styles.tableWrapper}>
            <h3 className={styles.tableHeader}>Upcoming Renewals</h3>
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{ maxHeight: 200, overflow: "auto" }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                paddingLeft={2}
                paddingTop={2}
              >
                <Typography variant="subtitle1" fontSize={14}>
                  Showing {customerMetrics?.upcoming_renewals.length || 0} items
                </Typography>
              </Box>
              <Table stickyHeader aria-label="upcoming renewals table">
                <TableHead>
                  <TableRow>
                    <TableCell className={styles.headerCell}>
                      Customer Name
                    </TableCell>
                    <TableCell className={styles.headerCell} align="right">
                      MRR
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customerMetrics?.upcoming_renewals.map((renewal, index) => (
                    <TableRow key={index} sx={tableRowStyle(index)}>
                      <TableCell component="th" scope="row">
                        {renewal.name}
                      </TableCell>
                      <TableCell align="right">
                        ${(renewal.mrr_cents / 100).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
        <div
          className={styles.loadingWrapper}
          style={{ visibility: loading ? "visible" : "hidden" }}
        >
          <CircularProgress />
        </div>
      </div>
    </MetricsGroupBase>
  );
};

export default CustomerMetrics;
