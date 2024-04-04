import { getCurrentUser } from "@/lib/firebase/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { stripeService } from "@/lib/stripe/stripeService";
import { stripe } from "@/lib/stripe/stripeConfig";
import Stripe from "stripe";

export async function GET(request: NextRequest) {
    console.log("here!")
  // ensure request contains session cookie and is valid
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect("/login");
  }

  // Products
  // log in green  "Products"
  console.log(
    "%c Products",
    "color: green; font-size: 16px; font-weight: bold;"
  );

  const products = await stripe.products.list({ limit: 100 });
  console.log(JSON.stringify(products));

  // Prices
  console.log(
    "%c Prices",
    "color: yellow; font-size: 16px; font-weight: bold;"
  );

  for (const product of products.data) {
    const prices = await stripe.prices.list({ product: product.id });
    console.log(JSON.stringify(prices));
  }

  // billing cycles
  const aggregateBillingIntervals = async () => {
    const prices = await stripe.prices.list({ limit: 100 });
    const intervals = prices.data.map(price => price.recurring?.interval ).filter(Boolean) as Stripe.Price.Recurring.Interval[];
    const uniqueIntervals = [...new Set(intervals)];
    return uniqueIntervals;
  };
    console.log(
        "%c Billing Cycles",
        "color: orange; font-size: 16px; font-weight: bold;"
    );
    console.log(await aggregateBillingIntervals());


  return NextResponse.json({
    success: true,
  });
}
