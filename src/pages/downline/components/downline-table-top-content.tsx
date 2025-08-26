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
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/outline";
import { DownlineFilters } from "@/hooks/useDownlines";

interface DownlineTableTopContentProps {
  filters: DownlineFilters;
  onFilterChange: (field: keyof DownlineFilters, value: any) => void;
  onSearchSubmit: () => void;
  onResetFilters: () => void;
  totalItems: number;
}

export const DownlineTableTopContent: React.FC<
  DownlineTableTopContentProps
> = ({
  filters,
  onFilterChange,
  onSearchSubmit,
  onResetFilters,
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
        {/* Grup Kiri: Semua filter */}
        <div className="flex flex-wrap gap-3 items-end">
          <Input
            className="w-full sm:max-w-[150px]"
            placeholder="Kode Agen..."
            value={filters.kode}
            onValueChange={(v) => onFilterChange("kode", v)}
          />
          <Input
            className="w-full sm:max-w-[150px]"
            placeholder="Nama Agen..."
            value={filters.nama}
            onValueChange={(v) => onFilterChange("nama", v)}
          />
          <Input
            className="w-full sm:max-w-[150px]"
            placeholder="Kode Upline..."
            value={filters.kode_upline}
            onValueChange={(v) => onFilterChange("kode_upline", v)}
          />
          <Dropdown>
            <DropdownTrigger>
              <Button
                endContent={<ChevronDownIcon className="h-4 w-4" />}
                variant="flat"
                className="min-w-[120px] justify-between"
              >
                {STATUS_OPTIONS.find((s) => s.uid === filters.status)?.name ||
                  "Status"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Filter by status"
              closeOnSelect
              selectedKeys={new Set([filters.status])}
              selectionMode="single"
              onAction={(key) => onFilterChange("status", key)}
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
          <Button
            color="primary"
            type="submit"
            startContent={<MagnifyingGlassIcon className="h-5 w-5" />}
          >
            Cari
          </Button>
          <Tooltip content="Reset Filter" placement="top" closeDelay={0}>
            <Button
              isIconOnly
              variant="light"
              onPress={onResetFilters}
              className="text-default-500"
              aria-label="Reset Filter"
            >
              <ArrowsRightLeftIcon className="h-5 w-5" />
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
