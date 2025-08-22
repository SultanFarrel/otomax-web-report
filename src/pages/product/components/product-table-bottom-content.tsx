// sultanfarrel/otomax-web-report/otomax-web-report-new-api/src/pages/product/components/product-table-bottom-content.tsx
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

const pageSizeOptions = [
  { uid: "10", name: "10" },
  { uid: "20", name: "20" },
  { uid: "30", name: "30" },
  { uid: "50", name: "50" },
  { uid: "100", name: "100" },
];

interface ProductTableBottomContentProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

const BottomContent: React.FC<ProductTableBottomContentProps> = ({
  page,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
}) => {
  return (
    <div className="py-2 px-2 flex justify-center items-center relative">
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
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
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

export const ProductTableBottomContent = React.memo(BottomContent);
