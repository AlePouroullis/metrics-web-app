import MRRMetrics from "./MRRMetrics";
import CustomerMetrics from "./CustomerMetrics";
import RevenueMetrics from "./RevenueMetrics";
import DateFilter from "./DateFilter";
import styles from "./Metrics.module.scss";
import MetricPrompt from "./MetricPrompt";

export default function Metrics() {
  return (
    <div>
      <div className={styles.filters}>
        <DateFilter disabled={true} />
      </div>
      <div className={styles.metricGroupingsList}>
        <MRRMetrics />
        <CustomerMetrics />
        <RevenueMetrics />
        <MetricPrompt />
      </div>
    </div>
  );
}
