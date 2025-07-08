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
import { Chip } from "@heroui/chip";
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
  { name: "NAMA", uid: "nama" },
  { name: "KODE", uid: "kode" },
  { name: "HARGA JUAL", uid: "harga_jual" },
  { name: "HARGA BELI", uid: "harga_beli" },
  { name: "STATUS", uid: "aktif" },
];

const statusOptions = [
  { name: "Semua", uid: "all" },
  { name: "Aktif", uid: "1" },
  { name: "Nonaktif", uid: "0" },
];

export default function ProdukPage() {
  // 2. Panggil hook untuk mendapatkan semua logika, state, dan data
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

  // Fungsi renderCell tetap sama
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
        case "aktif":
          return (
            <Chip
              className="capitalize"
              color={cellValue ? "success" : "danger"}
              size="sm"
              variant="flat"
            >
              {cellValue ? "Aktif" : "Nonaktif"}
            </Chip>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  // topContent dan bottomContent sekarang menggunakan state dari hook
  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Cari berdasarkan kode produk..."
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
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Filter by status"
                closeOnSelect
                selectedKeys={new Set([statusFilter])}
                selectionMode="single"
                onAction={onStatusChange}
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
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {data?.totalItems || 0} produk
          </span>
        </div>
      </div>
    );
  }, [
    filterValue,
    onSearchChange,
    statusFilter,
    onStatusChange,
    data?.totalItems,
  ]);

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
  }, [page, data, setPage]);

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
