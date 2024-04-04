import { getCurrentUser } from "@/lib/firebase/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { stripeService } from "@/lib/stripe/stripeService";

export async function GET(request: NextRequest) {
  // ensure request contains session cookie and is valid
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect("/login");
  }

  try {
    const mrrMetrics = await stripeService.getMrrMetrics();

    // return random metric data
    return NextResponse.json({
      success: true,
      data: mrrMetrics,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: (error as any).message,
    });
  }
}
