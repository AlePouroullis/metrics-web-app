// lib/stripe/stripeService.ts
import Stripe from "stripe";
import { stripe } from "./stripeConfig"; // Your existing Stripe config
import {
  CustomerMetricsData,
  MRRMetricsData,
  RevenueMetricsData,
} from "@/types";
import { mrrCalculations } from "./mrrCalculations";
import { customerService } from "./customerService";

interface SubscriptionParams extends Stripe.SubscriptionListParams {
  status?: Stripe.Subscription.Status;
  created?: Stripe.RangeQueryParam | number;
}

async function getAllSubscriptions(
  params?: SubscriptionParams
): Promise<Stripe.Subscription[]> {
  let allSubscriptions: Stripe.Subscription[] = [];
  let lastSubscriptionId: string | null = null;

  while (true) {
    const requestParams: Stripe.SubscriptionListParams = {
      limit: 100,
      ...params,
    };

    if (lastSubscriptionId) {
      requestParams.starting_after = lastSubscriptionId;
    }

    const subscriptions: Stripe.ApiList<Stripe.Subscription> =
      await stripe.subscriptions.list(requestParams);
    allSubscriptions = allSubscriptions.concat(subscriptions.data);

    if (!subscriptions.has_more) {
      break;
    }

    lastSubscriptionId = subscriptions.data[subscriptions.data.length - 1].id;
  }

  return allSubscriptions;
}

async function getMrrMetrics(): Promise<MRRMetricsData> {
  const subscriptionsPresent = await getAllSubscriptions();
  const startPeriodTimestampSeconds = Math.floor(
    new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).getTime() / 1000
  );

  // 1. MRR
  const mrr = (
    await stripeService.getAllSubscriptions({
      status: "active",
    })
  )
    .map(mrrCalculations.calculateMRR)
    .reduce((acc, val) => acc + val, 0);

  // 2. Net New MRR: New MRR - Churned MRR. Should also technically include upgrades and downgrades, but
  // these are complex to calculate.
  const newMrr = (
    await stripeService.getAllSubscriptions({
      status: "active",
      created: {
        gte: startPeriodTimestampSeconds,
      },
    })
  )
    .map(mrrCalculations.calculateMRR)
    .reduce((acc, val) => acc + val, 0);

  const churnedMrr = (
    await stripeService.getAllSubscriptions({
      status: "canceled",
      created: {
        gte: startPeriodTimestampSeconds,
      },
    })
  )
    .map(mrrCalculations.calculateMRR)
    .reduce((acc, val) => acc + val, 0);
  const netNewMrr = newMrr - churnedMrr;

  // 3. MRR Growth Rate
  // get all subscriptions at start of month for calculating growth rate
  const subscriptionsAtStartOfMonth = await getAllSubscriptions({
    status: "active",
    created: {
      lte: startPeriodTimestampSeconds,
    },
  });
  const mrrAtEnd = subscriptionsPresent
    .map(mrrCalculations.calculateMRR)
    .reduce((acc, val) => acc + val, 0);
  const mrrAtStart = subscriptionsAtStartOfMonth
    .map(mrrCalculations.calculateMRR)
    .reduce((acc, val) => acc + val, 0);

  // If division by zero, set growth rate to 0
  let mrrGrowthRate = 0;
  if (mrrAtStart !== 0) {
    mrrGrowthRate = ((mrrAtEnd - mrrAtStart) / mrrAtStart) * 100;
  }

  return {
    mrr_cents: mrr,
    net_new_mrr_cents: netNewMrr,
    new_mrr_cents: newMrr,
    churned_mrr_cents: churnedMrr,
    mrr_growth_rate: mrrGrowthRate,
  };
}

async function getCustomerMetrics(): Promise<CustomerMetricsData> {
  const periodStart = Math.floor(
    new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).getTime() / 1000
  );
  const periodEnd = Math.floor(new Date().getTime() / 1000);
  const allCustomers = await customerService.getAllCustomers();

  // 1. New customers within given period
  const newCustomers = customerService.getNewCustomers(
    allCustomers,
    periodStart,
    periodEnd
  );

  const totalCustomers = allCustomers.length;

  const upcomingRenewals = await customerService.getUpcomingRenewals(30);

  const churnedCustomers = await customerService.getChurnedCustomers(
    periodStart,
    periodEnd
  );

  const churnRate =
    (churnedCustomers.length / (totalCustomers - newCustomers.length)) * 100;

  const customerMetrics = {
    total_customers: totalCustomers,
    new_customers: newCustomers.length,
    churned_customers: churnedCustomers,
    upcoming_renewals: upcomingRenewals,
    churn_rate: churnRate,
  };

  return customerMetrics;
}

async function getRevenueMetrics(
  periodStartTimestamp: number,
  periodEndTimestamp: number
): Promise<RevenueMetricsData> {
  // 1. Net cash in
  // get all payments in
  const paymentsIn = await stripe.charges.list({
    created: { gte: periodStartTimestamp, lte: periodEndTimestamp },
  });
  const totalPayments = paymentsIn.data.reduce(
    (acc, charge) => acc + charge.amount,
    0
  );

  // get all refunds
  const refunds = await stripe.refunds.list({
    created: {
      gte: periodStartTimestamp,
      lte: periodEndTimestamp,
    },
  });

  const totalRefunds = refunds.data.reduce(
    (acc, refund) => acc + refund.amount,
    0
  );

  const disputes = await stripe.disputes.list({
    created: {
      gte: periodStartTimestamp,
      lte: periodEndTimestamp,
    },
  });
  const totalDisputes = disputes.data.reduce(
    (acc, dispute) => acc + dispute.amount,
    0
  );

  const netCashIn = totalPayments - totalRefunds - totalDisputes;

  return {
    net_cash_in_cents: netCashIn,
    revenue_per_product: [],
    net_revenue_retention: 0,
  };
}

export const stripeService = {
  getAllSubscriptions,
  getMrrMetrics,
  getCustomerMetrics,
  getRevenueMetrics,
};
