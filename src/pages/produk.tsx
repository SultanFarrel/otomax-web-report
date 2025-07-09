import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Chip, ChipProps } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Pagination } from "@heroui/pagination";
import { Spinner } from "@heroui/spinner";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useProducts } from "@/hooks/useProducts"; // <-- 1. Impor custom hook
import { Product } from "@/types"; // <-- Impor tipe Product

const columns = [
  { name: "KODE", uid: "kode" },
  { name: "NAMA", uid: "nama" },
  { name: "HARGA BELI", uid: "harga_beli" },
  { name: "HARGA JUAL", uid: "harga_jual" },
  { name: "STATUS", uid: "status" },
];

const statusOptions = [
  { name: "Semua", uid: "all" },
  { name: "Aktif", uid: "aktif" },
  { name: "Tidak Aktif", uid: "nonaktif" },
  { name: "Kosong", uid: "kosong" },
  { name: "Gangguan", uid: "gangguan" },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
  Aktif: "success",
  "Tidak Aktif": "default",
  Kosong: "warning",
  Gangguan: "danger",
};

// Helper untuk menentukan status produk
const getProductStatus = (product: Product): string => {
  if (product.gangguan) return "Gangguan";
  if (product.kosong) return "Kosong";
  if (product.aktif) return "Aktif";
  return "Tidak Aktif";
};

export default function ProdukPage() {
  const {
    data,
    isLoading,
    isError,
    page,
    setPage,
    filterValue,
    onSearchChange,
    statusFilter,
    onStatusChange,
  } = useProducts();

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
    return statusOptions.find((status) => status.uid === statusFilter)?.name;
  }, [isStatusFilterTouched, statusFilter]);

  const renderCell = React.useCallback(
    (product: Product, columnUid: React.Key) => {
      const cellValue = product[columnUid as keyof Product];

      switch (columnUid) {
        case "nama":
          return (
            <div>
              <p className="font-bold text-sm">{cellValue}</p>
              <p className="text-xs text-default-500">
                {product.kode_operator}
              </p>
            </div>
          );
        case "harga_jual":
        case "harga_beli":
          return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(cellValue as number);

        // --- Logika Status Baru ---
        case "status": {
          const statusText = getProductStatus(product);
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[statusText]}
              size="sm"
              variant="flat"
            >
              {statusText}
            </Chip>
          );
        }
        default:
          return cellValue;
      }
    },
    []
  );

  const topContent = React.useMemo(
    () => (
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
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {status.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <span className="text-default-400 text-small">
          Total {data?.totalItems || 0} produk
        </span>
      </div>
    ),
    [
      filterValue,
      onSearchChange,
      statusFilter,
      onStatusChange,
      data?.totalItems,
      statusButtonText,
    ]
  );

  const bottomContent = React.useMemo(() => {
    if (!data || data.totalPages <= 1) return null;
    return (
      <div className="py-2 px-2 flex justify-center items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={data.totalPages}
          onChange={setPage}
        />
      </div>
    );
  }, [page, data]);

  return (
    <Table
      aria-label="Tabel data produk"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      topContent={topContent}
      topContentPlacement="outside"
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align="start">
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={
          isLoading
            ? " "
            : isError
              ? "Gagal memuat data"
              : "Produk tidak ditemukan"
        }
        items={data?.data || []}
        isLoading={isLoading}
        loadingContent={<Spinner label="Memuat data..." />}
      >
        {(item) => (
          <TableRow key={item.kode}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
