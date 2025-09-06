import React, { useState } from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button, ButtonGroup } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useChartStats, TimeRange } from "@/hooks/dashboard/useChartStats";
import { formatCurrency } from "@/utils/formatters";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const TransactionChartCard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("weekly");
  const { data, isLoading, isError } = useChartStats(timeRange);

  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: "Deposit Member",
        data: data?.depositData || [],
        borderColor: "hsl(var(--heroui-primary))", // Warna Biru untuk Deposit
        backgroundColor: "hsla(var(--heroui-primary), 0.2)",
        yAxisID: "y",
        tension: 0.4,
      },
      {
        label: "Nilai Transaksi Sukses",
        data: data?.transactionData || [],
        borderColor: "hsl(var(--heroui-success))", // Warna Hijau untuk Transaksi
        backgroundColor: "hsla(var(--heroui-success), 0.2)",
        yAxisID: "y",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "hsl(var(--heroui-foreground) / 0.6)",
        },
      },
      tooltip: {
        backgroundColor: "hsl(var(--heroui-background))",
        titleColor: "hsl(var(--heroui-foreground))",
        bodyColor: "hsl(var(--heroui-foreground))",
        borderColor: "hsl(var(--heroui-border))",
        borderWidth: 1,
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "hsl(var(--heroui-foreground) / 0.6)",
        },
      },

      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        grid: {
          color: "hsl(var(--heroui-border))",
        },
        ticks: {
          color: "hsl(var(--heroui-foreground) / 0.6)",
          callback: function (value: any) {
            return formatCurrency(value, { notation: "compact" });
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2">
          <div>
            <h3 className="text-lg font-semibold">Grafik Performa</h3>
            <p className="text-sm text-default-500">
              Analitik deposit member dan transaksi sukses.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ButtonGroup>
              <Button
                variant={timeRange === "weekly" ? "solid" : "flat"}
                onPress={() => setTimeRange("weekly")}
              >
                Mingguan
              </Button>
              <Button
                variant={timeRange === "monthly" ? "solid" : "flat"}
                onPress={() => setTimeRange("monthly")}
              >
                Bulanan
              </Button>
              <Button
                variant={timeRange === "yearly" ? "solid" : "flat"}
                onPress={() => setTimeRange("yearly")}
              >
                Tahunan
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="h-80 w-full">
          {isLoading ? (
            <Spinner label="Memuat data chart..." />
          ) : isError ? (
            <p className="text-danger">Gagal memuat data chart.</p>
          ) : (
            <Line options={options} data={chartData} />
          )}
        </div>
      </CardBody>
    </Card>
  );
};
