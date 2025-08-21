import React from "react";
import { STATUS_OPTIONS } from "../constants/downline-constants";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Input } from "@heroui/input";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

interface DownlineTableTopContentProps {
  filterValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (key: React.Key) => void;
  totalItems: number;
}

export const DownlineTableTopContent: React.FC<
  DownlineTableTopContentProps
> = ({
  filterValue,
  onSearchChange,
  statusFilter,
  onStatusChange,
  totalItems,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Cari berdasarkan nama/kode..."
          startContent={<MagnifyingGlassIcon className="h-5 w-5" />}
          value={filterValue}
          onClear={() => onSearchChange("")}
          onValueChange={onSearchChange}
        />
        <div className="flex gap-3">
          <Dropdown>
            <DropdownTrigger>
              <button className="flex items-center gap-1">
                Status <ChevronDownIcon className="h-4 w-4" />
              </button>
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
      </div>
      <span className="text-default-400 text-small">
        Total {totalItems} downline
      </span>
    </div>
  );
};
