import Stripe from "stripe";
import { stripeService } from "./stripeService";

/**
 * Gets the number of new customers after the given threshold time.
 */
function getNewCustomerCount(
  customers: Stripe.ApiList<Stripe.Customer>,
  thresholdTime: number
) {}
