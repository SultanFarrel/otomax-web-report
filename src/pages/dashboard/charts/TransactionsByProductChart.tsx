import React, { useMemo } from "react";
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
import { useTopProductsAndResellers } from "@/hooks/dashboard/useTopProductsAndResellers";
import { TransactionsByProductChartSkeleton } from "../components/skeleton/TransactionsByProductChart.skeleton";

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
];

interface ChartProps {
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
  limit,
  onLimitChange,
}) => {
  const {
    data: TopProductsData,
    isLoading,
    isError,
  } = useTopProductsAndResellers(limit);

  const sortedData = useMemo(() => {
    // 1. Handle jika data belum ada (saat loading atau error)
    if (!TopProductsData?.topProducts) {
      return [];
    }
    // 2. Map data ke format yang dibutuhkan chart ({kode, value})
    const mappedData = TopProductsData.topProducts.map((product) => ({
      kode: product.kode_produk,
      value: product.jumlah,
    }));
    // 3. Sortir data yang sudah di-map
    return mappedData.sort((a, b) => b.value - a.value);
  }, [TopProductsData]);

  const chart = useMemo(
    () => (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={sortedData}
            dataKey="value"
            nameKey="kode"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={60}
            fill="#8884d8"
            paddingAngle={2}
            labelLine={false}
            label={({ percent = 0 }) => {
              if (percent < 0.05) return null;
              return `${(percent * 100).toFixed(0)}%`;
            }}
          >
            {sortedData.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<SortedLegend data={sortedData} />} />
        </PieChart>
      </ResponsiveContainer>
    ),
    [sortedData]
  );

  if (isLoading) {
    return <TransactionsByProductChartSkeleton />;
  }

  if (isError || !TopProductsData) {
    return (
      <div className="grid grid-cols-1">
        <Card className="bg-danger-50 border-danger-200">
          <CardBody>
            <p className="text-danger-700">Gagal memuat chart.</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <Card className="p-4">
      <CardHeader className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Top Produk (7 hari terakhir)</h3>

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
        {sortedData.length > 0 ? chart : <div>Data tidak tersedia</div>}
      </CardBody>
    </Card>
  );
};
