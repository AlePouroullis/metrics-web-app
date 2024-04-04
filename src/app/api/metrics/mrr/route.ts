import { getCurrentUser } from "@/lib/firebase/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { stripeService } from "@/lib/stripe/stripeService";

export async function GET(request: NextRequest) {
  // ensure request contains session cookie and is valid
  const user = await getCurrentUser();
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url);
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
