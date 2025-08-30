import React from "react";
import { Pagination } from "@heroui/pagination";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";

const pageSizeOptions = [
  { uid: "10", name: "10" },
  { uid: "20", name: "20" },
  { uid: "30", name: "30" },
  { uid: "50", name: "50" },
  { uid: "100", name: "100" },
];

interface DownlineTransactionTableBottomContentProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  onExport: () => void;
  isExporting: boolean;
}

export const DownlineTransactionTableBottomContent: React.FC<
  DownlineTransactionTableBottomContentProps
> = ({
  page,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  onExport,
  isExporting,
}) => {
  return (
    <div className="py-2 px-2 flex justify-between items-center relative">
      {/* Kiri: Tombol Export */}
      <div className="flex items-center gap-2">
        <Button
          color="success"
          variant="ghost"
          startContent={
            !isExporting && <ArrowDownTrayIcon className="h-4 w-4" />
          }
          onPress={onExport}
          isLoading={isExporting}
        >
          {isExporting ? "Mengekspor..." : "Export to Excel"}
        </Button>
      </div>

      {/* Paginasi di Tengah */}
      <Pagination
        isCompact
        showControls
        showShadow
        color="primary"
        page={page}
        total={totalPages || 1}
        onChange={onPageChange}
      />

      {/* Kanan: Page Size Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-default-600 hidden sm:block">
          Data per halaman:
        </span>
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              endContent={<ChevronDownIcon className="h-4 w-4" />}
            >
              {pageSize}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Page size"
            closeOnSelect
            selectedKeys={new Set([String(pageSize)])}
            selectionMode="single"
            onAction={(key) => onPageSizeChange(Number(key))}
          >
            {pageSizeOptions.map((option) => (
              <DropdownItem key={option.uid}>{option.name}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};
