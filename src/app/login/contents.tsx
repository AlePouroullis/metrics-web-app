"use client";

import React from "react";
import Button from "@mui/material/Button";
import { signInWithGoogle } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import styles from "./styles.module.scss";

export default function LoginPageContents() {
  const router = useRouter();
  const signIn = async () => {
    try {
      const loginResponse = await signInWithGoogle();
      if (loginResponse.success) {
        router.push("/dashboard"); // Updated to use navigation.push for redirecting.
      } else {
        alert("Sign in failed: " + loginResponse.error || "Unknown error");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      alert("Sign in failed: " + (error as any).message);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Stripe Metrics</h1>
      </div>
      <div className={styles.form}>
        <Button
          className={styles.button}
          variant="contained"
          color="primary"
          onClick={signIn}
        >
          Sign in with Google
        </Button>
        <p className={styles.infoText}>Only authorized emails permitted.</p>
      </div>
    </div>
  );
}
