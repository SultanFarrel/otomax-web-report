import React from "react";
import { STATUS_OPTIONS } from "../constants/product-constants";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Listbox, ListboxItem } from "@heroui/listbox";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Chip } from "@heroui/chip"; // <-- Impor komponen Chip
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { Provider } from "@/hooks/useProducts";

// ... (interface tetap sama)
interface ProductTableTopContentProps {
  filterValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (key: React.Key) => void;
  providerFilter: string;
  onProviderChange: (key: React.Key) => void;
  providers: Provider[] | undefined;
  isProvidersLoading: boolean;
  onResetFilters: () => void;
  totalItems: number;
}

export const ProductTableTopContent: React.FC<ProductTableTopContentProps> = ({
  filterValue,
  onSearchChange,
  statusFilter,
  onStatusChange,
  providerFilter,
  onProviderChange,
  providers,
  isProvidersLoading,
  onResetFilters,
  totalItems,
}) => {
  const [isStatusFilterTouched, setIsStatusFilterTouched] =
    React.useState(false);
  const [isProviderOpen, setIsProviderOpen] = React.useState(false);
  const [providerSearch, setProviderSearch] = React.useState("");

  const statusButtonText = React.useMemo(() => {
    if (!isStatusFilterTouched || statusFilter === "all") {
      return "Status";
    }
    return STATUS_OPTIONS.find((status) => status.uid === statusFilter)?.name;
  }, [isStatusFilterTouched, statusFilter]);

  const providerItems = React.useMemo(() => {
    let filtered = providers || [];
    if (providerSearch) {
      filtered = filtered.filter((provider) =>
        provider.nama.toLowerCase().includes(providerSearch.toLowerCase())
      );
    }
    return [
      { kode: "all", nama: "Semua Provider", gangguan: 0, kosong: 0 },
      ...filtered,
    ];
  }, [providers, providerSearch]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap justify-between gap-3 items-end">
        <Input
          isClearable
          className="w-full sm:max-w-xs"
          placeholder="Cari berdasarkan nama/kode..."
          startContent={<MagnifyingGlassIcon className="h-5 w-5" />}
          value={filterValue}
          onClear={() => onSearchChange("")}
          onValueChange={onSearchChange}
        />
        <div className="flex flex-wrap gap-3 items-end">
          <Popover
            isOpen={isProviderOpen}
            onOpenChange={setIsProviderOpen}
            placement="bottom-start"
          >
            <PopoverTrigger>
              <Button
                variant="flat"
                className="w-full sm:w-48 justify-between"
                endContent={<ChevronDownIcon className="h-4 w-4" />}
                isLoading={isProvidersLoading}
              >
                {providers?.find((p) => p.kode === providerFilter)?.nama ||
                  "Pilih Provider"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-full sm:w-48">
              <div className="flex flex-col gap-2 p-2">
                <Input
                  isClearable
                  placeholder="Cari provider..."
                  value={providerSearch}
                  onValueChange={setProviderSearch}
                  onClear={() => setProviderSearch("")}
                />
                <Listbox
                  aria-label="Daftar Provider"
                  variant="flat"
                  className="max-h-60 overflow-y-auto"
                  onAction={(key) => {
                    onProviderChange(key);
                    setIsProviderOpen(false);
                  }}
                  items={providerItems}
                >
                  {(item) => (
                    <ListboxItem key={item.kode} textValue={item.nama}>
                      <div className="flex justify-between items-center w-full">
                        <span>{item.nama}</span>
                        {/* --- PERUBAHAN DI SINI: Tampilkan Chip Status --- */}
                        {item.gangguan === 1 && (
                          <Chip color="danger" variant="flat" size="sm">
                            Gangguan
                          </Chip>
                        )}
                        {item.kosong === 1 && (
                          <Chip color="warning" variant="flat" size="sm">
                            Kosong
                          </Chip>
                        )}
                      </div>
                    </ListboxItem>
                  )}
                </Listbox>
              </div>
            </PopoverContent>
          </Popover>

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
