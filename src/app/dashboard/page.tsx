import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/firebase/firebaseAdmin";
import DashboardPageContents from "./contents";
import styles from "./styles.module.scss";

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  return (
    <main className={styles.main}>
      <DashboardPageContents />
    </main>
  );
}
