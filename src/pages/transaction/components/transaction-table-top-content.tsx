// src/pages/transaction/components/transaction-table-top-content.tsx

import React from "react";
import { RangeValue } from "@react-types/shared";
import { formatCurrency, formatDateRange } from "@/utils/formatters";
import { STATUS_OPTIONS } from "../constants/transaction-constants";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { RangeCalendar, DateValue } from "@heroui/calendar";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { TransactionFilters } from "@/hooks/useTransactions";
import { Chip } from "@heroui/chip";
import { today, getLocalTimeZone } from "@internationalized/date";

interface SummaryData {
  amount: number;
  count: number;
}

interface TransactionTableTopContentProps {
  filters: TransactionFilters;
  onFilterChange: (field: keyof TransactionFilters, value: any) => void;
  onSearchSubmit: () => void;
  onResetFilters: () => void;
  totalItems: number;
  summary: {
    success: SummaryData;
    pending: SummaryData;
    failed: SummaryData;
  };
}

export const TransactionTableTopContent: React.FC<
  TransactionTableTopContentProps
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

  const handleStatusChange = (key: React.Key) => {
    onFilterChange("status", key as string);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
      {/* Container utama dengan justify-between */}
      <div className="flex flex-wrap gap-3 items-end justify-between">
        {/* Grup Kiri: Date Range Picker */}
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
              className="min-w-[210px] justify-start"
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

        {/* Grup Kanan: Semua filter dan tombol lainnya */}
        <div className="flex flex-wrap gap-3 items-end justify-end">
          <Input
            className="max-w-[120px]"
            placeholder="TRX ID"
            value={filters.trxId}
            onValueChange={(v) => onFilterChange("trxId", v)}
          />
          <Input
            className="max-w-[120px]"
            placeholder="Ref ID"
            value={filters.refId}
            onValueChange={(v) => onFilterChange("refId", v)}
          />
          <Input
            className="max-w-[120px]"
            placeholder="Produk"
            value={filters.kodeProduk}
            onValueChange={(v) => onFilterChange("kodeProduk", v)}
          />
          <Input
            className="max-w-[120px]"
            placeholder="Tujuan"
            value={filters.tujuan}
            onValueChange={(v) => onFilterChange("tujuan", v)}
          />
          <Input
            className="max-w-[120px]"
            placeholder="SN"
            value={filters.sn}
            onValueChange={(v) => onFilterChange("sn", v)}
          />
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="flat"
                endContent={<ChevronDownIcon className="h-4 w-4" />}
                className="min-w-[120px] justify-between"
              >
                {STATUS_OPTIONS.find((s) => s.uid === filters.status)?.name ||
                  "Status"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Filter Status"
              closeOnSelect
              selectedKeys={new Set([filters.status])}
              selectionMode="single"
              onAction={handleStatusChange}
            >
              {STATUS_OPTIONS.map((status) => (
                <DropdownItem key={status.uid}>{status.name}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Button
            color="primary"
            type="submit"
            startContent={<MagnifyingGlassIcon className="h-5 w-5" />}
          >
            Cari
          </Button>
          <Tooltip content="Reset Filter" closeDelay={0}>
            <Button isIconOnly variant="light" onPress={onResetFilters}>
              <ArrowPathIcon className="h-5 w-5" />
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Bagian bawah: Total item dan Ringkasan dalam bentuk Chip */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <span className="text-default-400 text-small">
          Total {totalItems} transaksi ditemukan.
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <Chip color="success" size="sm" variant="flat">
            Sukses: {formatCurrency(summary.success.amount)} (
            {summary.success.count} Trx)
          </Chip>
          <Chip color="primary" size="sm" variant="flat">
            Pending: {formatCurrency(summary.pending.amount)} (
            {summary.pending.count} Trx)
          </Chip>
          <Chip color="danger" size="sm" variant="flat">
            Gagal: {formatCurrency(summary.failed.amount)} (
            {summary.failed.count} Trx)
          </Chip>
        </div>
      </div>
    </form>
  );
};
