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
  limit: string;
  onLimitChange: (value: string) => void;
  onSearchSubmit: () => void;
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
    limit,
    onLimitChange,
    onSearchSubmit,
    onResetFilters,
    totalItems,
  } = props;

  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  const handleDateChangeAndClose = (range: RangeValue<DateValue>) => {
    onDateChange(range);

    if (range.start && range.end) {
      setIsCalendarOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap justify-between gap-3 items-end">
        {/* Kolom Kiri */}
        <form
          className="flex flex-wrap gap-3 items-end w-full sm:w-auto"
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit();
          }}
        >
          <Input
            isClearable
            className="w-full sm:w-[250px]"
            placeholder="Cari keterangan..."
            startContent={<MagnifyingGlassIcon className="h-5 w-5" />}
            value={filterValue}
            onClear={() => onSearchChange("")}
            onValueChange={onSearchChange}
          />
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
                {formatDateRange(dateRange)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <RangeCalendar
                aria-label="Date filter"
                value={dateRange}
                onChange={handleDateChangeAndClose}
              />
            </PopoverContent>
          </Popover>

          <Button color="primary" type="submit">
            Cari
          </Button>
        </form>

        {/* Kolom Kanan */}
        <div className="flex flex-wrap gap-3 items-end">
          <Input
            aria-label="Set Limit Data"
            placeholder="500"
            type="number"
            className="w-28"
            value={limit}
            onValueChange={onLimitChange}
          />
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
