import styles from "./MetricsGroupBase.module.scss";

type Props = {
  children: React.ReactNode;
  title: string;
};

export default function MetricsGroupBase({ children, title }: Props) {
  return (
    <div className={styles.metricBase}>
      <div className={styles.header}>
        <h2>{title}</h2>
      </div>
      <div className={styles.childrenWrapper}>{children}</div>
    </div>
  );
}
