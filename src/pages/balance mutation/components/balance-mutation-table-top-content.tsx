// sultanfarrel/otomax-web-report/otomax-web-report-new-api/src/pages/balance mutation/components/balance-mutation-table-top-content.tsx

import React from "react";
import { RangeValue } from "@react-types/shared";
import { formatCurrency, formatDateRange } from "@/utils/formatters";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { RangeCalendar, DateValue } from "@heroui/calendar";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Chip } from "@heroui/chip";
import { CheckboxGroup, Checkbox } from "@heroui/checkbox";
import {
  MagnifyingGlassIcon,
  CalendarIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { BalanceMutationFilters } from "@/hooks/useBalanceMutation";
import { today, getLocalTimeZone } from "@internationalized/date";

interface SummaryData {
  credit: number;
  debit: number;
  total: number;
}

interface BalanceMutationTableTopContentProps {
  filters: BalanceMutationFilters;
  onFilterChange: (field: keyof BalanceMutationFilters, value: any) => void;
  onSearchSubmit: () => void;
  onResetFilters: () => void;
  totalItems: number;
  summary: SummaryData;
}

const mutationTypeOptions = [
  { value: "Semua", label: "Semua" },
  { value: "Manual", label: "Manual" },
  { value: "Transaksi", label: "Transaksi" },
  { value: "Refund", label: "Refund" },
  { value: "Komisi", label: "Komisi" },
  { value: "Transfer Saldo", label: "Transfer Saldo" },
  { value: "Tiket", label: "Tiket" },
];

export const BalanceMutationTableTopContent: React.FC<
  BalanceMutationTableTopContentProps
> = (props) => {
  const {
    filters,
    onFilterChange,
    onSearchSubmit,
    onResetFilters,
    totalItems,
    summary,
  } = props;

  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  // --- LOGIKA UNTUK MEMBATASI TANGGAL ---
  const now = today(getLocalTimeZone());
  const minValue = now.subtract({ days: 7 });
  const maxValue = now;
  // -----------------------------------------

  const handleDateChangeAndClose = (range: RangeValue<DateValue>) => {
    onFilterChange("dateRange", range);

    if (range.start && range.end) {
      setIsCalendarOpen(false);
    }
  };

  const summaryColor = React.useMemo(() => {
    if (summary.total > 0) return "success";
    if (summary.total < 0) return "danger";
    return "primary";
  }, [summary.total]);

  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearchSubmit();
        }}
      >
        {/* Baris 1: Filter utama dan tombol aksi */}
        <div className="flex flex-wrap justify-between gap-3 items-end">
          <div className="flex flex-wrap gap-3 items-end w-full sm:w-auto">
            <Popover
              placement="bottom-start"
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
                  {formatDateRange(filters.dateRange)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <RangeCalendar
                  aria-label="Date filter"
                  value={filters.dateRange}
                  onChange={handleDateChangeAndClose}
                  minValue={minValue}
                  maxValue={maxValue}
                />
              </PopoverContent>
            </Popover>
            <Input
              isClearable
              className="w-full sm:w-[250px]"
              placeholder="Cari keterangan..."
              startContent={<MagnifyingGlassIcon className="h-5 w-5" />}
              value={filters.search}
              onClear={() => onFilterChange("search", "")}
              onValueChange={(value) => onFilterChange("search", value)}
            />
          </div>
          <div className="flex flex-wrap gap-3 items-end">
            <Button color="primary" type="submit">
              Cari
            </Button>
            <Tooltip content="Reset Filter" placement="bottom" closeDelay={0}>
              <Button
                isIconOnly
                variant="light"
                onPress={onResetFilters}
                className="text-default-500"
                aria-label="Reset Filter"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </Button>
            </Tooltip>
          </div>
        </div>

        {/* Baris 2: Checkbox Group */}
        <div className="mt-3">
          <CheckboxGroup
            label="Jenis Mutasi"
            orientation="horizontal"
            value={filters.mutationTypes}
            onValueChange={(value) => onFilterChange("mutationTypes", value)}
          >
            {mutationTypeOptions.map((option) => (
              <Checkbox key={option.value} value={option.value}>
                {option.label}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </div>
      </form>

      {/* Baris 3: Informasi Total */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <span className="text-default-400 text-small">
          Total {totalItems} mutasi ditemukan.
        </span>
        <Chip color={summaryColor} size="sm" variant="flat">
          Total Jumlah: {formatCurrency(summary.credit)} -{" "}
          {formatCurrency(Math.abs(summary.debit))} ={" "}
          {formatCurrency(summary.total)}
        </Chip>
      </div>
    </div>
  );
};
