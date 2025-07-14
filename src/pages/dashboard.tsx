import { TransactionsByProductChart } from "@/pages/dashboard/charts/TransactionsByProductChart";
import { TransactionsByStatusChart } from "@/pages/dashboard/charts/TransactionsByStatusChart";
import { useTransactionSummary } from "@/hooks/useTransactionSummary";
import { Card } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { RangeCalendar } from "@heroui/calendar";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { ArrowPathIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { formatDateRange } from "@/utils/formatters";

export default function IndexPage() {
  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    limit,
    setLimit,
    // Ambil state dan handler tanggal dari hook
    dateRange,
    onDateChange,
    resetDateFilter,
  } = useTransactionSummary();

  return (
    <div className="flex flex-col gap-8">
      {/* Filter Tanggal */}
      <div className="flex justify-end">
        <Popover placement="bottom-end">
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
              onChange={onDateChange}
            />
          </PopoverContent>
        </Popover>
        {/* 3. Tombol Reset, hanya muncul jika ada filter tanggal */}
        {dateRange && (
          <Tooltip content="Reset Filter" placement="bottom">
            <Button
              isIconOnly
              variant="light"
              onPress={resetDateFilter}
              aria-label="Reset filter tanggal"
              className="ml-2"
            >
              <ArrowPathIcon className="h-5 w-5 text-default-500" />
            </Button>
          </Tooltip>
        )}
      </div>

      {/* Bagian untuk merender grafik */}
      {isSummaryLoading ? (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card className="flex h-[402px] w-full items-center justify-center p-4">
            <Spinner label="Memuat data grafik..." />
          </Card>
          <Card className="flex h-[402px] w-full items-center justify-center p-4">
            <Spinner label="Memuat data grafik..." />
          </Card>
        </div>
      ) : isSummaryError ? (
        <p className="text-center text-danger">Gagal memuat data ringkasan.</p>
      ) : (
        summaryData && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <TransactionsByStatusChart
              data={summaryData.transactionsByStatus}
            />
            <TransactionsByProductChart
              data={summaryData.transactionsByProduct}
              limit={limit}
              onLimitChange={setLimit}
            />
          </div>
        )
      )}
    </div>
  );
}
