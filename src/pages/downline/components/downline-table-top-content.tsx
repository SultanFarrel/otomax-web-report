// sultanfarrel/otomax-web-report/otomax-web-report-new-api/src/pages/downline/components/downline-table-top-content.tsx
import React from "react";
import { STATUS_OPTIONS } from "../constants/downline-constants";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface DownlineTableTopContentProps {
  filterValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onResetFilters: () => void;
  statusFilter: string;
  onStatusChange: (key: React.Key) => void;
  totalItems: number;
}

export const DownlineTableTopContent: React.FC<
  DownlineTableTopContentProps
> = ({
  filterValue,
  onSearchChange,
  onSearchSubmit,
  onResetFilters,
  statusFilter,
  onStatusChange,
  totalItems,
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearchSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-wrap justify-between gap-3 items-end">
        {/* Grup Kiri: Search dan Status */}
        <div className="flex gap-3 w-full sm:w-auto">
          <Input
            isClearable
            className="w-full sm:max-w-xs"
            placeholder="Cari nama/kode..."
            startContent={<MagnifyingGlassIcon className="h-5 w-5" />}
            value={filterValue}
            onClear={() => onSearchChange("")}
            onValueChange={onSearchChange}
          />
          <Dropdown>
            <DropdownTrigger>
              <Button
                endContent={<ChevronDownIcon className="h-4 w-4" />}
                variant="flat"
                className="min-w-[120px] justify-between"
              >
                {STATUS_OPTIONS.find((s) => s.uid === statusFilter)?.name ||
                  "Status"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Filter by status"
              closeOnSelect
              selectedKeys={new Set([statusFilter])}
              selectionMode="single"
              onAction={(key) => onStatusChange(key)}
            >
              {STATUS_OPTIONS.map((status) => (
                <DropdownItem key={status.uid} className="capitalize">
                  {status.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* Grup Kanan: Tombol Aksi */}
        <div className="flex gap-3">
          <Button color="primary" type="submit">
            Cari
          </Button>
          <Tooltip content="Refresh" placement="bottom" closeDelay={0}>
            <Button isIconOnly variant="light" onPress={onResetFilters}>
              <ArrowPathIcon className="h-5 w-5" />
            </Button>
          </Tooltip>
        </div>
      </div>
      <span className="text-default-400 text-small">
        Total {totalItems} downline ditemukan.
      </span>
    </form>
  );
};
