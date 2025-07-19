import React, { useState } from "react"; // Impor useState
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
import { Spinner } from "@heroui/spinner";
import { Tooltip as TooltipComponent } from "@heroui/tooltip";

interface ChartProps {
  data: { status: string; jumlah: number }[];
  dateRange: RangeValue<DateValue> | null;
  onDateChange: (range: RangeValue<DateValue>) => void;
  onResetDateFilter: () => void;
  isUpdating?: boolean;
}

export const TransactionsByStatusChart: React.FC<ChartProps> = ({
  data,
  dateRange,
  onDateChange,
  onResetDateFilter,
  isUpdating,
}) => {
  // Langkah 1: Tambahkan state untuk mengontrol visibilitas popover
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Langkah 3: Buat handler baru
  const handleDateChangeAndClose = (range: RangeValue<DateValue>) => {
    // Jalankan fungsi update dari parent
    onDateChange(range);

    // Jika tanggal awal dan akhir sudah terpilih, tutup popover
    if (range.start && range.end) {
      setIsCalendarOpen(false);
    }
  };

  return (
    <Card className="p-4">
      <CardHeader className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Transaksi per Status</h3>

        <div className="flex items-center gap-2">
          {/* Langkah 2: Jadikan Popover controlled */}
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
                onChange={handleDateChangeAndClose} // Gunakan handler baru
              />
            </PopoverContent>
          </Popover>
          {dateRange && (
            <TooltipComponent content="Reset Filter" placement="bottom">
              <Button
                isIconOnly
                variant="light"
                onPress={onResetDateFilter}
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
        {isUpdating && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <Spinner size="md" />
          </div>
        )}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
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
