// lib/stripe/mrrCalculations.ts
import { Stripe } from "stripe";

/**
 * Normalize a subscription to a monthly revenue amount.
 * Stripe subscriptions can have different billing intervals (e.g. weekly, monthly, yearly)
 * as well as interval counts (e.g. every 2 months, every 3 years).
 * For example, a subscription with a monthly billing interval and an interval count of 3
 * would be normalized to 1/3 of the monthly revenue. So, say the subscription costs $30, the interval is "monthly",
 * and the interval count is 3 (quarterly), the normalized monthly revenue would be $10.
 *
 * @returns The normalized monthly revenue amount in cents (USD).
 */
function normalizeSubscriptionToMonthly(
  subscription: Stripe.Subscription
): number {
  let revenue = 0;
  subscription.items.data.forEach((item) => {
    // total revenue over the period
    const itemRevenue = (item.price.unit_amount ?? 0) * (item.quantity ?? 1);
    // the interval count specifies the amount of intervals (e.g. months) between each billing cycle
    const intervalCount = item.price.recurring?.interval_count || 1; // Default to 1 if not specified

    const revenueForSingleInterval = itemRevenue / intervalCount;
    switch (item.price.recurring?.interval) {
      case "month":
        revenue += revenueForSingleInterval;
        break;
      case "year":
        revenue += revenueForSingleInterval / 12;
        break;
      case "week":
        revenue += revenueForSingleInterval * 4.33; // Approximate 4.33 weeks per month
        break;
      case "day":
        revenue += revenueForSingleInterval * 30; // Approximate 30 days per month
        break;
      default:
        throw new Error(
          `Unhandled interval: ${item.price.recurring?.interval}`
        );
    }
  });
  return revenue;
}

function calculateMRR(subscription: Stripe.Subscription): number {
  let revenue = normalizeSubscriptionToMonthly(subscription);
  // Deduct discount if applicable
  if (subscription.discount && subscription.discount.coupon.amount_off) {
    // Assuming the discount is a fixed amount off and applicable to the total monthly revenue
    // Note: Consider the currency and ensure it matches the subscription items
    revenue -= subscription.discount.coupon.amount_off;
  } else if (
    subscription.discount &&
    subscription.discount.coupon.percent_off
  ) {
    // If the discount is a percentage off the total price
    const discountPercent = subscription.discount.coupon.percent_off / 100;
    revenue -= revenue * discountPercent;
  }
  return revenue;
}

function calculateNewMRR(
  subscriptions: Stripe.Subscription[],
  start: number,
  end: number
): number {
  return subscriptions
    .filter(
      (subscription) =>
        subscription.created >= start && subscription.created <= end
    )
    .map((subscription) => normalizeSubscriptionToMonthly(subscription))
    .reduce((acc, val) => acc + val, 0);
}

export const mrrCalculations = {
  calculateMRR,
  normalizeSubscriptionToMonthly,
  calculateNewMRR,
};
