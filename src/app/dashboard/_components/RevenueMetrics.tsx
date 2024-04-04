// components/RevenueMetrics.js
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import MetricsGroupBase from "./MetricsGroupBase";
import styles from "./RevenueMetrics.module.scss";
import metricBaseStyles from "./MetricsGroupBase.module.scss";
import { APIResponse, RevenueMetricsData } from "@/types";

const RevenueMetrics = () => {
  const [revenueMetricsData, setRevenueMetricsData] =
    useState<RevenueMetricsData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await fetch("/api/metrics/revenue");
      const data = (await response.json()) as APIResponse<RevenueMetricsData>;
      setLoading(false);
      if (!data.success || !data.data) {
        console.error(data.error);
        return;
      }
      setRevenueMetricsData(data.data!);
    })();
  }, []);

  const renderContent = () => {
    if (loading || !revenueMetricsData) {
      return (
        <div className={styles.loadingWrapper}>
          <CircularProgress />
        </div>
      );
    }
    return (
      <div className={styles.content}>
        <div className={metricBaseStyles.dataItem}>
          <span>Net Cash In</span>
          <span>
            ${(revenueMetricsData?.net_cash_in_cents / 100).toFixed(2)}
          </span>
        </div>
        <div className={metricBaseStyles.separator} />
        <div className={metricBaseStyles.dataItem}>
          <span>Net Revenue Retention</span>
          <span>
            {(revenueMetricsData.net_revenue_retention / 100).toFixed(2)}%
          </span>
        </div>
        <div className={metricBaseStyles.separator} />
        <div>
          <h6 className={styles.tableHeader}>Revenue per Product</h6>
          <TableContainer component={Paper}>
            <Table aria-label="revenue per product">
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell align="right">Revenue ($)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {revenueMetricsData.revenue_per_product.map(
                  (product, index) => (
                    <TableRow
                      key={product.name}
                      className={`${styles.row} ${
                        index % 2 === 0 ? styles.even : styles.odd
                      }`}
                    >
                      <TableCell component="th" scope="row">
                        {product.name}
                      </TableCell>
                      <TableCell align="right">
                        {(product.revenue / 100).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    );
  };

  return (
    <MetricsGroupBase title="Revenue Metrics">
      <div className={styles.body}>{renderContent()}</div>
    </MetricsGroupBase>
  );
};

export default RevenueMetrics;
