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
import { ProductFilters } from "@/hooks/useProducts";
import { useGroups } from "@/hooks/useGroup"; // Selalu import useGroups

interface ProductTableTopContentProps {
  filters: ProductFilters;
  onFilterChange: (field: keyof ProductFilters, value: any) => void;
  onSearchSubmit: () => void;
  onResetFilters: () => void;
  totalItems: number;
  isAdmin?: boolean; // Tambahkan prop isAdmin
}

export const ProductTableTopContent: React.FC<ProductTableTopContentProps> = ({
  filters,
  onFilterChange,
  onSearchSubmit,
  onResetFilters,
  totalItems,
  isAdmin = false, // Default value false
}) => {
  const [isStatusFilterTouched, setIsStatusFilterTouched] =
    React.useState(false);

  // Hook untuk mengambil data grup (hanya akan dipanggil jika isAdmin true)
  const { data: groupOptions, isLoading: isGroupsLoading } = useGroups({
    isAdmin,
  });

  const statusButtonText = React.useMemo(() => {
    if (!isStatusFilterTouched || filters.status === "all") {
      return "Status";
    }
    return STATUS_OPTIONS.find((status) => status.uid === filters.status)?.name;
  }, [isStatusFilterTouched, filters.status]);

  // Tentukan apakah filter utama harus ditampilkan
  // Untuk admin, filter tampil setelah grup dipilih. Untuk user, selalu tampil.
  const showMainFilters = isAdmin
    ? filters.group && filters.group !== ""
    : true;

  return (
    <div className="flex flex-col gap-4">
      <form
        className="flex flex-col sm:flex-row flex-wrap justify-between gap-3 items-end"
        onSubmit={(e) => {
          e.preventDefault();
          onSearchSubmit();
        }}
      >
        {/* Grup Kiri: Filters */}
        <div className="flex gap-3 w-full sm:w-auto">
          {/* --- Filter Grup (Hanya untuk Admin) --- */}
          {isAdmin && (
            <Dropdown>
              <DropdownTrigger>
                <Button
                  endContent={<ChevronDownIcon className="h-4 w-4" />}
                  variant="flat"
                  className="min-w-[140px] justify-between"
                  isDisabled={isGroupsLoading || !groupOptions}
                >
                  {filters.group === "" || !filters.group
                    ? "Pilih Grup"
                    : (groupOptions?.find((g) => g.kode === filters.group)
                        ?.nama ?? "Grup")}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Filter by group"
                closeOnSelect
                selectedKeys={new Set([filters.group || ""])}
                selectionMode="single"
                onAction={(key) => onFilterChange("group", String(key))}
              >
                <DropdownItem key="">— Pilih Grup —</DropdownItem>
                <>
                  {groupOptions &&
                    groupOptions.map((group) => (
                      <DropdownItem key={group.kode}>{group.nama}</DropdownItem>
                    ))}
                </>
              </DropdownMenu>
            </Dropdown>
          )}

          {/* --- Filter Utama (Search & Status) --- */}
          {showMainFilters && (
            <>
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
            </>
          )}
        </div>

        {/* Grup Kanan: Tombol Aksi */}
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            color="primary"
            type="submit"
            startContent={<MagnifyingGlassIcon className="h-5 w-5" />}
            className="w-full sm:w-auto"
            // Tombol Cari dinonaktifkan untuk admin jika grup belum dipilih
            isDisabled={isAdmin && (!filters.group || filters.group === "")}
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
        Total {totalItems} produk ditemukan
      </span>
    </div>
  );
};
