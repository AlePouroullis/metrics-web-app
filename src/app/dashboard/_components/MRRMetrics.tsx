import { useEffect, useState } from "react";

import MetricsGroupBase from "./MetricsGroupBase";
import styles from "./MRRMetrics.module.scss";
import metricBaseStyles from "./MetricsGroupBase.module.scss";
import { APIResponse, MRRMetricsData } from "@/types";
import { CircularProgress, Tooltip } from "@mui/material";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import ArrowRightIcon from "@mui/icons-material/ArrowRight"; // For indented items
import InfoIcon from "@mui/icons-material/Info";

function IndicatorIcon({ status }: { status: "increase" | "decrease" }) {
  return (
    <div
      className={`${styles.indicatorIcon} ${
        status === "increase" ? styles.increase : styles.decrease
      }`}
    >
      {status === "increase" ? (
        <TrendingUpRoundedIcon color="success" className={styles.icon} />
      ) : (
        <TrendingDownRoundedIcon color="error" className={styles.icon} />
      )}
    </div>
  );
}

const MRRMetrics = () => {
  const [mrrMetrics, setMrrMetrics] = useState<MRRMetricsData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const response = await fetch("/api/metrics/mrr");
      const json = (await response.json()) as APIResponse<MRRMetricsData>;

      if (json.success) {
        setMrrMetrics(json.data!);
      } else {
        console.error(json.error);
      }
      setLoading(false);
    })();
  }, []);

  const renderMetricsList = () => {
    if (mrrMetrics) {
      return (
        <ul className={`${styles.metricsList}`}>
          <li>
            <span>Current MRR</span>
            <span className={styles.right}>
              ${(mrrMetrics.mrr_cents / 100).toFixed(2)}
            </span>
          </li>
          <div className={metricBaseStyles.separator}></div>
          <li className={styles.listItemWithInnerList}>
            <div className={styles.innerListHeader}>
              {
                <IndicatorIcon
                  status={
                    mrrMetrics.net_new_mrr_cents > 0 ? "increase" : "decrease"
                  }
                />
              }
              <span>Net New MRR</span>

              <Tooltip title="Calculated as new MRR minus churned MRR.">
                <InfoIcon className={styles.infoIcon} />
              </Tooltip>
              <span className={styles.right}>
                ${(mrrMetrics.net_new_mrr_cents / 100).toFixed(2)}
              </span>
            </div>
            <ul className={styles.indentedList}>
              <li>
                <ArrowRightIcon fontSize="small" />
                <div>
                  <IndicatorIcon status="increase" />
                </div>
                <span>New MRR</span>
                <span className={styles.right}>
                  ${(mrrMetrics.new_mrr_cents / 100).toFixed(2)}
                </span>
              </li>
              <li>
                <ArrowRightIcon fontSize="small" />
                <IndicatorIcon status="decrease" />
                <span>Churned MRR</span>
                <span className={styles.right}>
                  -${(mrrMetrics.churned_mrr_cents / 100).toFixed(2)}
                </span>
              </li>
            </ul>
          </li>
          <div className={metricBaseStyles.separator}></div>
          <li>
            <IndicatorIcon
              status={mrrMetrics.mrr_growth_rate > 0 ? "increase" : "decrease"}
            />
            <span>MRR Growth Rate</span>
            <Tooltip
              title="Percentage change in MRR from the start of the period to now. So, for example, if the period is a month, this is the percentage change one month ago to now."
              placement="top"
            >
              <InfoIcon className={styles.infoIcon} />
            </Tooltip>

            <span className={styles.right}>
              {mrrMetrics.mrr_growth_rate.toFixed(2)}%
            </span>
          </li>
        </ul>
      );
    }
    return <></>;
  };

  return (
    <MetricsGroupBase title={"MRR Breakdown"}>
      <div className={styles.content}>
        <div style={{ visibility: loading ? "hidden" : "visible" }}>
          {renderMetricsList()}
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

export default MRRMetrics;
