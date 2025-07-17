import React from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { RangeCalendar, DateValue } from "@heroui/calendar";
import { type RangeValue } from "@react-types/shared";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import { formatDateRange } from "@/utils/formatters";
import { CalendarIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

// Props disederhanakan, hanya membutuhkan data untuk BarChart
interface Props {
  transactionsByStatus: { status: string; jumlah: number }[];
  dateRange: RangeValue<DateValue> | null;
  onDateChange: (range: RangeValue<DateValue>) => void;
  onResetDateFilter: () => void;
}

export const TransactionChart: React.FC<Props> = ({
  transactionsByStatus,
  dateRange,
  onDateChange,
  onResetDateFilter,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-wrap justify-between items-center gap-4">
        <h3 className="text-lg font-semibold">Analisis Transaksi</h3>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Tanggal */}
          <Popover placement="bottom-end">
            <PopoverTrigger>
              <Button
                variant="flat"
                size="sm"
                startContent={
                  <CalendarIcon className="h-4 w-4 text-default-500" />
                }
              >
                {formatDateRange(dateRange)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <RangeCalendar
                aria-label="Filter tanggal"
                value={dateRange}
                onChange={onDateChange}
              />
            </PopoverContent>
          </Popover>
          {dateRange && (
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={onResetDateFilter}
              aria-label="Reset filter tanggal"
            >
              <ArrowPathIcon className="h-4 w-4 text-default-500" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={300}>
          {/* Hanya menampilkan BarChart */}
          <BarChart data={transactionsByStatus}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.1)"
            />
            <XAxis dataKey="status" fontSize={12} tick={{ fill: "#9ca3af" }} />
            <YAxis fontSize={12} tick={{ fill: "#9ca3af" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--heroui-background))",
                borderColor: "hsl(var(--heroui-divider))",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Bar
              dataKey="jumlah"
              name="Jumlah"
              fill="hsl(var(--heroui-primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};
