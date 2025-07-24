import { apiClient } from "@/api/axios";
import { RangeValue, DateValue } from "@heroui/calendar";
import { useQuery } from "@tanstack/react-query";

export function useTransactionStatusSummary(
  kodeUpline: string,
  dateRange: RangeValue<DateValue> | null
) {
  return useQuery({
    queryKey: ["statusSummary", kodeUpline, dateRange],
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/dashboard/status-summary/${kodeUpline}`,
        {
          params: {
            startDate: dateRange?.start?.toString(),
            endDate: dateRange?.end?.toString(),
          },
        }
      );
      return data;
    },
    enabled: !!kodeUpline,
  });
}
