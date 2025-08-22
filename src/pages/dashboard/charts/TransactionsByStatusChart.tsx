// sultanfarrel/otomax-web-report/otomax-web-report-new-api/src/pages/dashboard/charts/TransactionsByStatusChart.tsx

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { RangeCalendar, DateValue } from "@heroui/calendar";
import { RangeValue } from "@react-types/shared";
import { CalendarIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { formatDateRange } from "@/utils/formatters";
import { Tooltip as TooltipComponent } from "@heroui/tooltip";
import { useTransactionsByStatusChart } from "@/hooks/dashboard/useTransactionsByStatusChart";
import { TransactionsByStatusChartSkeleton } from "../components/skeleton/TransactionsByStatusChart.skeleton";
import { today, getLocalTimeZone } from "@internationalized/date";

export const TransactionsByStatusChart = ({}) => {
  const [dateRange, setDateRange] = useState<RangeValue<DateValue>>({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()),
  });

  const onDateChange = (range: RangeValue<DateValue>) => {
    setDateRange(range);
  };

  const {
    data: transactionChartData,
    refetch,
    isLoading,
    error,
  } = useTransactionsByStatusChart(dateRange);

  useEffect(() => {
    if (dateRange?.start && dateRange?.end) {
      refetch();
    }
  }, [dateRange, refetch]);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // --- LOGIKA UNTUK MEMBATASI TANGGAL ---
  const now = today(getLocalTimeZone());
  const minValue = now.subtract({ days: 7 });
  const maxValue = now;
  // -----------------------------------------

  const handleDateChangeAndClose = (range: RangeValue<DateValue>) => {
    onDateChange(range);

    if (range.start && range.end) {
      setIsCalendarOpen(false);
    }
  };

  const handleResetDateFilter = () => {
    setDateRange({
      start: today(getLocalTimeZone()),
      end: today(getLocalTimeZone()),
    });
    setIsCalendarOpen(false);
  };

  if (isLoading) {
    return <TransactionsByStatusChartSkeleton />;
  }

  if (error) {
    return (
      <div className="grid grid-cols-1">
        <Card className="bg-danger-50 border-danger-200">
          <CardBody>
            <p className="text-danger-700">
              {error?.message?.trim() ? error.message : "Gagal memuat data"}
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <Card className="p-4">
      <CardHeader className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Transaksi per Status {dateRange ? "" : "Hari ini"}
        </h3>

        <div className="flex items-center gap-2">
          <Popover
            placement="bottom-end"
            isOpen={isCalendarOpen}
            onOpenChange={setIsCalendarOpen}
          >
            <PopoverTrigger>
              <Button
                variant="flat"
                startContent={
                  <CalendarIcon className="h-4 w-4 text-default-500" />
                }
              >
                {formatDateRange(dateRange)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <RangeCalendar
                aria-label="Filter tanggal dashboard"
                value={dateRange}
                onChange={handleDateChangeAndClose}
                minValue={minValue}
                maxValue={maxValue}
              />
            </PopoverContent>
          </Popover>
          {dateRange && (
            <TooltipComponent
              content="Refresh Chart"
              placement="bottom"
              closeDelay={0}
            >
              <Button
                isIconOnly
                variant="light"
                onPress={handleResetDateFilter}
                aria-label="Reset filter tanggal"
                className="ml-2"
              >
                <ArrowPathIcon className="h-5 w-5 text-default-500" />
              </Button>
            </TooltipComponent>
          )}
        </div>
      </CardHeader>
      <CardBody className="relative overflow-hidden">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={transactionChartData}
            margin={{
              top: 5,
              right: 20,
              left: -10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="status"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <RechartTooltip
              contentStyle={{
                backgroundColor: "hsl(var(--heroui-background))",
                borderColor: "hsl(var(--heroui-divider))",
              }}
            />
            <Legend />
            <Bar
              dataKey="jumlah"
              fill="hsl(var(--heroui-primary))"
              name="Jumlah Transaksi"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};
