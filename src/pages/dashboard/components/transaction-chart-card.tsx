import React, { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button, ButtonGroup } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import {
  Chart as ChartJS,
  CategoryScale,
  Colors,
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
import { useThemeStore } from "@/store/themeStore";

ChartJS.register(
  CategoryScale,
  Colors,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const lightModeColors = {
  primary: "#2563eb",
  primaryBg: "rgba(37, 99, 235, 0.2)",
  success: "#16a34a",
  successBg: "rgba(22, 163, 74, 0.2)",
  foreground: "rgba(23, 37, 84, 0.6)",
  border: "#e2e8f0",
  tooltipBg: "#ffffff",
  tooltipText: "#1e293b",
};

const darkModeColors = {
  primary: "#60a5fa",
  primaryBg: "rgba(96, 165, 250, 0.2)",
  success: "#4ade80",
  successBg: "rgba(74, 222, 128, 0.2)",
  foreground: "rgba(226, 232, 240, 0.6)",
  border: "#334155",
  tooltipBg: "#1e293b",
  tooltipText: "#e2e8f0",
};

export const TransactionChartCard: React.FC = () => {
  const { theme } = useThemeStore();
  const [timeRange, setTimeRange] = useState<TimeRange>("weekly");
  const { data, isLoading, isError } = useChartStats(timeRange);
  const [activeColors, setActiveColors] = useState(lightModeColors);

  useEffect(() => {
    setActiveColors(theme === "dark" ? darkModeColors : lightModeColors);
  }, [theme]);

  const chartData = useMemo(
    () => ({
      labels: data?.labels || [],
      datasets: [
        {
          label: "Deposit Member",
          data: data?.depositData || [],
          borderColor: activeColors.primary,
          backgroundColor: activeColors.primaryBg,
          yAxisID: "y",
          tension: 0.4,
        },
        {
          label: "Nilai Transaksi Sukses",
          data: data?.transactionData || [],
          borderColor: activeColors.success,
          backgroundColor: activeColors.successBg,
          yAxisID: "y",
          tension: 0.4,
        },
      ],
    }),
    [data, activeColors]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
          labels: {
            color: activeColors.foreground,
          },
        },
        tooltip: {
          backgroundColor: activeColors.tooltipBg,
          titleColor: activeColors.tooltipText,
          bodyColor: activeColors.tooltipText,
          borderColor: activeColors.border,
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
          grid: { display: false },
          ticks: { color: activeColors.foreground },
        },
        y: {
          type: "linear" as const,
          display: true,
          position: "left" as const,
          grid: { color: activeColors.border },
          ticks: {
            color: activeColors.foreground,
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
    }),
    [activeColors]
  );

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
