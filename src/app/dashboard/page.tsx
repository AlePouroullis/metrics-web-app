import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/firebase/firebaseAdmin";
import DashboardPageContents from "./contents";

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  return (
    <main className="container">
      <DashboardPageContents />
    </main>
  );
}
