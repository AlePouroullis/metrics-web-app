import { getCurrentUser } from "@/lib/firebase/firebaseAdmin";
import openai from "@/lib/openai/openai";
import { stripe } from "@/lib/stripe/stripeConfig";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // ensure request contains session cookie and is valid
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect("/login");
  }

  // get query parameters from request
  const input = request.nextUrl.searchParams.get("input") ?? "";

  const payments = await stripe.paymentIntents.list({ limit: 10 });
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content: input,
      },
    ],
  });

  console.log(completion);

  // return random metric data
  return NextResponse.json({
    success: true,
    data: {
      revenue:
        payments.data.reduce((acc, payment) => {
          if (payment.status === "succeeded") {
            return acc + payment.amount;
          } else {
            return acc;
          }
        }, 0) / 100,
      chat: completion.choices[0].message.content,
    },
  });
}
