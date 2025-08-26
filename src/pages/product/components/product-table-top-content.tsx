// sultanfarrel/otomax-web-report/otomax-web-report-new-api/src/pages/product/components/product-table-top-content.tsx
import React from "react";
import { STATUS_OPTIONS } from "../constants/product-constants";
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
import { ProductFilters } from "@/hooks/useProducts"; // Impor tipe ProductFilters

interface ProductTableTopContentProps {
  filters: ProductFilters;
  onFilterChange: (field: keyof ProductFilters, value: any) => void;
  onSearchSubmit: () => void;
  onResetFilters: () => void;
  totalItems: number;
}

export const ProductTableTopContent: React.FC<ProductTableTopContentProps> = ({
  filters,
  onFilterChange,
  onSearchSubmit,
  onResetFilters,
  totalItems,
}) => {
  const [isStatusFilterTouched, setIsStatusFilterTouched] =
    React.useState(false);

  const statusButtonText = React.useMemo(() => {
    if (!isStatusFilterTouched || filters.status === "all") {
      return "Status";
    }
    return STATUS_OPTIONS.find((status) => status.uid === filters.status)?.name;
  }, [isStatusFilterTouched, filters.status]);

  return (
    <div className="flex flex-col gap-4">
      <form
        className="flex flex-wrap justify-between gap-3 items-end"
        onSubmit={(e) => {
          e.preventDefault();
          onSearchSubmit();
        }}
      >
        {/* Grup Kiri: Search dan Status */}
        <div className="flex gap-3 w-full sm:w-auto">
          <Input
            isClearable
            className="w-full sm:max-w-xs"
            placeholder="Cari nama/kode..."
            startContent={<MagnifyingGlassIcon className="h-5 w-5" />}
            value={filters.search}
            onClear={() => onFilterChange("search", "")}
            onValueChange={(value) => onFilterChange("search", value)}
          />
          <Dropdown>
            <DropdownTrigger>
              <Button
                endContent={<ChevronDownIcon className="h-4 w-4" />}
                variant="flat"
                className="min-w-[120px] justify-between"
              >
                {statusButtonText}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Filter by status"
              closeOnSelect
              selectedKeys={new Set([filters.status])}
              selectionMode="single"
              onAction={(key) => {
                onFilterChange("status", key);
                setIsStatusFilterTouched(true);
              }}
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
              onPress={() => {
                onResetFilters();
                setIsStatusFilterTouched(false);
              }}
              className="text-default-500"
              aria-label="Reset Filter"
            >
              <ArrowsRightLeftIcon className="h-5 w-5" />
            </Button>
          </Tooltip>
        </div>
      </form>
      <span className="text-default-400 text-small">
        Total {totalItems} produk
      </span>
    </div>
  );
};
