import { signInWithPopup } from "firebase/auth";

import { APIResponse } from "@/types";
import { auth, provider } from "./firebaseConfig";


export async function signInWithGoogle(): Promise<APIResponse<string>> {
  try {
    const userCreds = await signInWithPopup(auth, provider);
    const idToken = await userCreds.user.getIdToken();

    const response = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });
    const resBody = (await response.json()) as unknown as APIResponse<string>;
    if (response.ok && resBody.success) {
      return {
        success: true,
        data: resBody.data,
      };
    } else {
      return {
        success: false,
        error: resBody.error,
      };
    }
  } catch (error) {
    console.error("Error signing in with Google", error);
    return {
      success: false,
      error: "Error signing in with Google",
    };
  }
}

export async function signOut() {
  try {
    await auth.signOut();

    const response = await fetch("/api/auth/sign-out", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resBody = (await response.json()) as unknown as APIResponse<string>;
    if (response.ok && resBody.success) {
      return true;
    } else return false;
  } catch (error) {
    console.error("Error signing out with Google", error);
    return false;
  }
}
