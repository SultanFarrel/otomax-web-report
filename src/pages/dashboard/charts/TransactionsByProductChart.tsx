import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardBody } from "@heroui/card";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF4560",
  "#775DD0",
  "#546E7A",
  "#26a69a",
  "#D10CE8",
];

const limitOptions = [
  { key: "3", label: "Top 3" },
  { key: "5", label: "Top 5" },
  { key: "10", label: "Top 10" },
];

interface ChartProps {
  data: { kode: string; value: number }[];
  limit: number;
  onLimitChange: (limit: number) => void;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-background border border-divider rounded-lg shadow-lg">
        <p className="font-semibold">{`${payload[0].name}`}</p>
        <p className="text-sm">{`Jumlah: ${payload[0].value} transaksi`}</p>
      </div>
    );
  }

  return null;
};

const SortedLegend = (props: { data: { kode: string; value: number }[] }) => {
  const { data } = props;
  return (
    <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 text-xs mt-4">
      {data.map((entry, index) => (
        <div key={`item-${index}`} className="flex items-center gap-1.5">
          <div
            className="w-2.5 h-2.5 rounded-sm"
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
          />
          <span>{entry.kode}</span>
        </div>
      ))}
    </div>
  );
};

export const TransactionsByProductChart: React.FC<ChartProps> = ({
  data,
  limit,
  onLimitChange,
}) => {
  return (
    <Card className="p-4">
      <CardHeader className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Top Produk</h3>

        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              endContent={<ChevronDownIcon className="h-4 w-4" />}
            >
              Top {limit}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Pilih Limit"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={new Set([String(limit)])}
            onAction={(key) => onLimitChange(Number(key))}
          >
            {limitOptions.map((option) => (
              <DropdownItem key={option.key}>{option.label}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="kode"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              labelLine={false}
              // FIX 2: Handle potentially undefined properties and remove unused 'entry'
              label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                percent,
              }) => {
                // Add a check to prevent rendering if properties are undefined
                if (
                  percent === undefined ||
                  midAngle === undefined ||
                  cx === undefined ||
                  cy === undefined ||
                  innerRadius === undefined ||
                  outerRadius === undefined
                ) {
                  return null;
                }
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                return (
                  <text
                    x={x}
                    y={y}
                    fill="white"
                    textAnchor={x > cx ? "start" : "end"}
                    dominantBaseline="central"
                    fontSize={12}
                  >
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
              minAngle={20}
            >
              {data.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            {/* FIX 1: Add a formatter to the Tooltip */}
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<SortedLegend data={data} />} />
          </PieChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};
