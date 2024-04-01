import { redirect } from "next/navigation";
import { isUserAuthenticated } from "@/lib/firebase/firebaseAdmin";
import LoginPageContents from "./contents";
import styles from "./styles.module.scss";

export default async function SignInPage() {
  if (await isUserAuthenticated()) redirect("/dashboard");

  return (
    <main className={styles.container}>
      <LoginPageContents />
    </main>
  );
}
