import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { auth, createSessionCookie } from "@/lib/firebase/firebaseAdmin";
import { db } from "@/lib/firebase/firebaseAdmin";
import { collection, doc, getDoc } from "firebase/firestore";

export async function POST(request: NextRequest) {
  const reqBody = (await request.json()) as { idToken: string };

  // decode token
  try {
    const decodedToken = await auth.verifyIdToken(reqBody.idToken);

    const doc = await db.doc(`users/${decodedToken.email}`).get();

    if (!doc.exists) {
      return NextResponse.json(
        { success: false, error: "User is not authorized to use this application." },
        { status: 400 }
      );
    }

    const idToken = reqBody.idToken;

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

    const sessionCookie = await createSessionCookie(idToken, { expiresIn });

    cookies().set("__session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
    });

    return NextResponse.json({
      success: true,
      message: "Signed in successfully.",
    });
  } catch (error) {
    console.error("Error signing in with Google", error);
    return NextResponse.json(
      { success: false, error: "Error signing in with Google" },
      { status: 500 }
    );
  }
}
