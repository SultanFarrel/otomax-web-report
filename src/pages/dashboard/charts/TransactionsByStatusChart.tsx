import React, { useState, useMemo, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
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

// Tentukan tipe props yang diterima komponen
interface ChartProps {
  data: { status: string; jumlah: number }[];
}

/**
 * Komponen untuk menampilkan grafik batang jumlah transaksi berdasarkan status,
 * dengan filter dropdown multi-pilihan.
 * @param data - Data yang sudah diagregasi dari API summary.
 */
export const TransactionsByStatusChart: React.FC<ChartProps> = ({ data }) => {
  // State untuk menyimpan status mana saja yang dipilih
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(
    new Set()
  );

  // Efek untuk menginisialisasi state saat data pertama kali tiba
  useEffect(() => {
    if (data && data.length > 0) {
      // Secara default, pilih semua status yang tersedia
      setSelectedStatuses(new Set(data.map((item) => item.status)));
    }
  }, [data]);

  // Gunakan useMemo untuk memfilter data yang akan ditampilkan di grafik
  // berdasarkan status yang dipilih.
  const filteredData = useMemo(() => {
    if (!data) return [];
    // Jika tidak ada yang dipilih, tampilkan data kosong
    if (selectedStatuses.size === 0) return [];
    // Filter data asli untuk hanya menyertakan status yang ada di `selectedStatuses`
    return data.filter((item) => selectedStatuses.has(item.status));
  }, [data, selectedStatuses]);

  // Handler untuk mengubah pilihan status
  const handleSelectionChange = (keys: any) => {
    setSelectedStatuses(new Set(keys));
  };

  return (
    <Card className="p-4">
      <CardHeader className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Transaksi per Status</h3>

        {/* Dropdown untuk filter status */}
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              endContent={<ChevronDownIcon className="h-4 w-4" />}
            >
              Pilih Status
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Pilih Status untuk ditampilkan"
            variant="flat"
            closeOnSelect={false} // Biarkan menu tetap terbuka saat memilih
            disallowEmptySelection
            selectionMode="multiple"
            selectedKeys={selectedStatuses}
            onSelectionChange={handleSelectionChange}
          >
            {(data || []).map((item) => (
              <DropdownItem key={item.status}>{item.status}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={filteredData} // Gunakan data yang sudah difilter
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
            <Tooltip
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
