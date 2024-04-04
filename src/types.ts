export type APIResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type MRRMetricsData = {
  /**
   * MRR for all subscriptions.
   */
  mrr_cents: number;
  new_mrr_cents: number;
  /**
   * MRR for new subscriptions the last 30 days.
   */
  net_new_mrr_cents: number;
  /**
   * MRR lost from churned subscriptions.
   */
  churned_mrr_cents: number;
  /**
   * MRR growth rate which is the percentage change in MRR from the start of the month to now.
   */
  mrr_growth_rate: number;
};

export interface ChurnedCustomer {
  id: string;
  name: string;
  canceled_at: number;
  mrr_cents: number;
}

export type CustomerMetricsData = {
  total_customers: number;
  new_customers: number;
  /**
   * Percentage of customers churned relative to the total number of customers at the start of a period.
   * Returned as a percentage between 0 and 100.
   */
  churn_rate: number;
  /**
   * List of customers who have churned, i.e. canceled their subscription.
   */
  churned_customers: ChurnedCustomer[];
  /**
   * List of upcoming renewals with the customer name and MRR.
   */
  upcoming_renewals: {
    name: string;
    date_of_renewal: Date;
    mrr_cents: number;
  }[];
};

export type RevenueMetricsData = {
  /**
   * Net cash in cents which is the total revenue minus any refunds.
   */
  net_cash_in_cents: number;
  revenue_per_product: { name: string; revenue: number }[];
  /**
   * Net revenue retention rate which is the percentage of revenue retained from existing customers.
   */
  net_revenue_retention: number;
};
