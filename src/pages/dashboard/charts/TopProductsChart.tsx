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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

interface ChartProps {
  data: { kode_produk: string; jumlah: number }[];
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

export const TopProductsChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Top Produk</h3>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="jumlah"
              nameKey="kode_produk"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              labelLine={false}
              minAngle={15}
            >
              {data.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} />
          </PieChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};
