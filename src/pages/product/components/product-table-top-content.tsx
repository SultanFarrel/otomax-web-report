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
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface ProductTableTopContentProps {
  filterValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  statusFilter: string;
  onStatusChange: (key: React.Key) => void;
  onResetFilters: () => void;
  totalItems: number;
}

export const ProductTableTopContent: React.FC<ProductTableTopContentProps> = ({
  filterValue,
  onSearchChange,
  onSearchSubmit,
  statusFilter,
  onStatusChange,
  onResetFilters,
  totalItems,
}) => {
  const [isStatusFilterTouched, setIsStatusFilterTouched] =
    React.useState(false);

  const statusButtonText = React.useMemo(() => {
    if (!isStatusFilterTouched || statusFilter === "all") {
      return "Status";
    }
    return STATUS_OPTIONS.find((status) => status.uid === statusFilter)?.name;
  }, [isStatusFilterTouched, statusFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap justify-between gap-3 items-end">
        <form
          className="flex gap-2 w-full sm:max-w-xs"
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit();
          }}
          action=""
        >
          <Input
            isClearable
            className="w-full sm:max-w-xs"
            placeholder="Cari berdasarkan nama/kode..."
            startContent={<MagnifyingGlassIcon className="h-5 w-5" />}
            value={filterValue}
            onClear={() => onSearchChange("")}
            onValueChange={onSearchChange}
          />
          <Button color="primary" type="submit">
            Cari
          </Button>
        </form>

        <div className="flex gap-3">
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
              aria-label="Filter by status"
              closeOnSelect
              selectedKeys={new Set([statusFilter])}
              selectionMode="single"
              onAction={(key) => {
                onStatusChange(key);
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
        Total {totalItems} produk
      </span>
    </div>
  );
};
