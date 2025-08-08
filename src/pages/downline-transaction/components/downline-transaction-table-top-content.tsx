import React from "react";
import { RangeValue } from "@react-types/shared";
import { formatDateRange } from "@/utils/formatters";
import {
  COLUMN_NAMES,
  STATUS_OPTIONS,
} from "../constants/downline-transactions-contants";
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

interface DownlineTransactionTableTopContentProps {
  filterValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (key: React.Key) => void;
  dateRange: RangeValue<DateValue> | null;
  onDateChange: (range: RangeValue<DateValue>) => void;
  visibleColumns: Set<string>;
  onVisibleColumnsChange: (keys: any) => void;
  onResetFilters: () => void;
  totalItems: number;
  limit: string;
  onLimitChange: (value: string) => void;
}

export const DownlineTransactionTableTopContent: React.FC<
  DownlineTransactionTableTopContentProps
> = (props) => {
  const {
    filterValue,
    onSearchChange,
    statusFilter,
    onStatusChange,
    dateRange,
    onDateChange,
    visibleColumns,
    onVisibleColumnsChange,
    onResetFilters,
    totalItems,
    limit,
    onLimitChange,
  } = props;

  const [isStatusFilterTouched, setIsStatusFilterTouched] =
    React.useState(false);

  const statusButtonText = React.useMemo(() => {
    if (!isStatusFilterTouched || statusFilter === "all") {
      return "Status";
    }
    return (
      STATUS_OPTIONS.find((status) => status.uid === statusFilter)?.name ||
      "Status"
    );
  }, [isStatusFilterTouched, statusFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap justify-between gap-3 items-end">
        <Input
          isClearable
          className="w-full sm:max-w-xs"
          placeholder="Cari..."
          startContent={<MagnifyingGlassIcon className="h-5 w-5" />}
          value={filterValue}
          onClear={() => onSearchChange("")}
          onValueChange={onSearchChange}
        />
        <div className="flex flex-wrap gap-3 items-end">
          <Input
            aria-label="Set Limit Data"
            placeholder="500"
            type="number"
            className="w-28"
            value={limit}
            onValueChange={onLimitChange}
          />
          <Dropdown>
            <DropdownTrigger>
              <Button
                endContent={<ChevronDownIcon className="h-4 w-4" />}
                variant="flat"
              >
                {statusButtonText}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Filter Status"
              closeOnSelect
              selectedKeys={new Set([statusFilter])}
              selectionMode="single"
              onAction={(key) => {
                onStatusChange(key);
                setIsStatusFilterTouched(true);
              }}
            >
              {STATUS_OPTIONS.map((status) => (
                <DropdownItem key={status.uid}>{status.name}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Dropdown>
            <DropdownTrigger>
              <Button
                endContent={<ChevronDownIcon className="h-4 w-4" />}
                variant="flat"
              >
                Kolom
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Tampilkan Kolom"
              closeOnSelect={false}
              selectedKeys={visibleColumns}
              selectionMode="multiple"
              onSelectionChange={onVisibleColumnsChange as any}
            >
              {COLUMN_NAMES.map((column) => (
                <DropdownItem key={column.uid}>{column.name}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Popover placement="bottom-start">
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
                aria-label="Date filter"
                value={dateRange}
                onChange={onDateChange}
              />
            </PopoverContent>
          </Popover>
          <Tooltip content="Reset Filter" placement="bottom" closeDelay={0}>
            <Button
              isIconOnly
              variant="light"
              onPress={() => {
                onResetFilters();
                setIsStatusFilterTouched(false);
              }}
              className="text-default-500"
              aria-label="Reset Filter"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </Button>
          </Tooltip>
        </div>
      </div>
      <span className="text-default-400 text-small">
        Total {totalItems} transaksi ditemukan.
      </span>
    </div>
  );
};
