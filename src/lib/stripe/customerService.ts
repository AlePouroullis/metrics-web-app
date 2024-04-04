import { stripe } from "@/lib/stripe/stripeConfig";
import Stripe from "stripe";
import { stripeService } from "./stripeService";
import { mrrCalculations } from "./mrrCalculations";
import { ChurnedCustomer } from "@/types";



async function getAllCustomers(): Promise<Stripe.Customer[]> {
  let allCustomers: Stripe.Customer[] = [];
  let lastCustomerId: string | null = null;

  while (true) {
    const requestParams: Stripe.CustomerListParams = {
      limit: 100,
    };

    if (lastCustomerId) {
      requestParams.starting_after = lastCustomerId;
    }

    const customers: Stripe.ApiList<Stripe.Customer> =
      await stripe.customers.list(requestParams);
    allCustomers = allCustomers.concat(customers.data);

    if (!customers.has_more) {
      break;
    }

    lastCustomerId = customers.data[customers.data.length - 1].id;
  }

  return allCustomers;
}

const getNewCustomers = (
  customersList: Stripe.Customer[],
  startTime: number,
  endTime: number
) => {
  const newCustomers = customersList.filter(
    (customer) => customer.created >= startTime && customer.created <= endTime
  );

  return newCustomers;
};

const getUpcomingRenewals = async (withinDays: number) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const endTime = currentTime + withinDays * 24 * 60 * 60;
  const activeSubscriptions = await stripeService.getAllSubscriptions({
    expand: ["data.customer"],
    status: "active",
    current_period_end: {
      gte: currentTime,
      lt: endTime,
    },
  });

  const upcomingRenewals = activeSubscriptions.filter(
    (sub) =>
      sub.current_period_end >= currentTime && sub.current_period_end <= endTime
  );

  return upcomingRenewals.reduce((acc, sub) => {
    acc.push({
      name: (sub.customer as Stripe.Customer).name ?? (sub.customer as string),
      date_of_renewal: new Date(sub.current_period_end * 1000),
      mrr_cents: mrrCalculations.calculateMRR(sub),
    });
    return acc;
  }, [] as { name: string; date_of_renewal: Date; mrr_cents: number }[]);

  // (sub.customer as Stripe.Customer).name,
  // new Date(sub.current_period_end),
};

const getChurnedCustomers = async (
  startTime: number,
  endTime: number
): Promise<ChurnedCustomer[]> => {
  let churnedCustomers: ChurnedCustomer[] = [];

  const subscriptions = await stripeService.getAllSubscriptions({
    status: "canceled",
    created: { gte: startTime, lte: endTime },
    expand: ["data.customer"],
  });

  for (const subscription of subscriptions) {
    churnedCustomers.push({
      id: (subscription.customer as Stripe.Customer).id,
      canceled_at: subscription.canceled_at || 0,
      name: (subscription.customer as Stripe.Customer).name ?? "",
      mrr_cents: mrrCalculations.calculateMRR(subscription),
    });
  }

  return churnedCustomers;
};

export const customerService = {
  getNewCustomers,
  getUpcomingRenewals,
  getChurnedCustomers,
  getAllCustomers,
};
