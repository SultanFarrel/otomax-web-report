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
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

interface ProductTableTopContentProps {
  filterValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (key: React.Key) => void;
  totalItems: number;
}

export const ProductTableTopContent: React.FC<ProductTableTopContentProps> = ({
  filterValue,
  onSearchChange,
  statusFilter,
  onStatusChange,
  totalItems,
}) => {
  // State baru untuk melacak interaksi status dropdown
  const [isStatusFilterTouched, setIsStatusFilterTouched] =
    React.useState(false);

  // Logika untuk menentukan teks tombol berdasarkan interaksi
  const statusButtonText = React.useMemo(() => {
    // Jika belum disentuh atau filter adalah 'Semua', tampilkan 'Status'
    if (!isStatusFilterTouched || statusFilter === "all") {
      return "Status";
    }
    // Jika sudah, tampilkan nama status yang aktif
    return STATUS_OPTIONS.find((status) => status.uid === statusFilter)?.name;
  }, [isStatusFilterTouched, statusFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Cari"
          startContent={<MagnifyingGlassIcon className="h-5 w-5" />}
          value={filterValue}
          onClear={() => onSearchChange("")}
          onValueChange={onSearchChange}
        />
        <div className="flex gap-3">
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
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
        </div>
      </div>
      <span className="text-default-400 text-small">
        Total {totalItems} produk
      </span>
    </div>
  );
};
