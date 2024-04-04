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
    // for now make 30 days ago
    const startPeriod = Math.floor(
      new Date(new Date().setDate(new Date().getDate() - 30)).getTime() / 1000
    );
    const endPeriod = Math.floor(new Date().getTime() / 1000);
    const revenueMetrics = await stripeService.getRevenueMetrics(
      startPeriod,
      endPeriod
    );

    // return random metric data
    return NextResponse.json({
      success: true,
      data: revenueMetrics,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: (error as any).message,
    });
  }
}
