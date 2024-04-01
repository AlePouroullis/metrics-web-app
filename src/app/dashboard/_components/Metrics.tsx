import { TextField } from "@mui/material";
import { useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayJs";
import MRRMetrics from "./MRRMetrics";
import CustomerMetrics from "./CustomerMetrics";
import RevenueMetrics from "./RevenueMetrics";

export default function Metrics() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker />
      </LocalizationProvider>
      <MRRMetrics
        currentMRR={0}
        churnedMRR={0}
        netNewMRR={0}
        mrrGrowthRate={0}
      />
      <CustomerMetrics
        totalCustomers={0}
        newCustomers={0}
        churnedCustomers={["1"]}
        upcomingRenewals={[{ name: "1", mrr: 0 }]}
      />
      <RevenueMetrics
        netCashIn={0}
        revenuePerProduct={[{ name: "product1", revenue: 0 }]}
        netRevenueRetention={0}
      />
    </div>
  );
}
