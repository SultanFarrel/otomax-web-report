import React from "react";
import { RangeValue } from "@react-types/shared";
import { formatDateRange } from "@/utils/formatters";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { RangeCalendar, DateValue } from "@heroui/calendar";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import {
  MagnifyingGlassIcon,
  CalendarIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface BalanceMutationTableTopContentProps {
  filterValue: string;
  onSearchChange: (value: string) => void;
  dateRange: RangeValue<DateValue> | null;
  onDateChange: (range: RangeValue<DateValue>) => void;
  onResetFilters: () => void;
  totalItems: number;
}

export const BalanceMutationTableTopContent: React.FC<
  BalanceMutationTableTopContentProps
> = (props) => {
  const {
    filterValue,
    onSearchChange,
    dateRange,
    onDateChange,
    onResetFilters,
    totalItems,
  } = props;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap justify-between gap-3 items-end">
        <Input
          isClearable
          className="w-full sm:max-w-xs"
          placeholder="Cari berdasarkan keterangan..."
          startContent={<MagnifyingGlassIcon className="h-5 w-5" />}
          value={filterValue}
          onClear={() => onSearchChange("")}
          onValueChange={onSearchChange}
        />
        <div className="flex flex-wrap gap-3 items-end">
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
              onPress={onResetFilters}
              className="text-default-500"
              aria-label="Reset Filter"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </Button>
          </Tooltip>
        </div>
      </div>
      <span className="text-default-400 text-small">
        Total {totalItems} mutasi ditemukan.
      </span>
    </div>
  );
};
