"use client";
import { signOut } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import styles from "./styles.module.scss";
import LogoutIcon from "@mui/icons-material/Logout";
import { IconButton } from "@mui/material";
import Metrics from "./_components/Metrics";
import MetricPrompt from "./_components/MetricPrompt";

export default function DashboardPageContents() {
  const router = useRouter();
  const signOutWrapper = async () => {
    if (confirm("Are you sure you want to sign out?")) {
      const successful = await signOut();
      if (successful) {
        router.push("/login");
      }
    }
  };
  return (
    <div>
      <div className={styles.topBar}>
        <div className={styles.header}>
          <h1>Stripe Metrics</h1>
        </div>
        <div className={styles.nav}>
          <IconButton onClick={signOutWrapper}>
            <LogoutIcon />
          </IconButton>
        </div>
      </div>
      <div className={styles.content}>
        <Metrics />
        <MetricPrompt />
      </div>
    </div>
  );
}
