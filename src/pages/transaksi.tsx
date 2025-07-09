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
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { RangeCalendar } from "@heroui/calendar";
import { Chip, ChipProps } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Pagination } from "@heroui/pagination";
import { Spinner } from "@heroui/spinner";
import { DateValue } from "@heroui/calendar";
import { Tooltip } from "@heroui/tooltip";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useTransactions } from "@/hooks/useTransactions";
import { Transaction } from "@/types";
import { RangeValue } from "@react-types/shared";

// ... (ALL_COLUMNS dan konstanta lainnya tetap sama) ...
const ALL_COLUMNS = [
  { name: "TRX ID", uid: "kode", sortable: true },
  { name: "TGL ENTRI", uid: "tgl_entri", sortable: true },
  { name: "PRODUK", uid: "kode_produk" },
  { name: "TUJUAN", uid: "tujuan" },
  { name: "PENGIRIM", uid: "pengirim" },
  { name: "STATUS", uid: "status" },
  { name: "HARGA", uid: "harga", sortable: true },
  { name: "SN", uid: "sn" },
];

const statusColorMap: Record<
  string,
  { color: ChipProps["color"]; text: string }
> = {
  "1": { color: "warning", text: "Proses" },
  "20": { color: "success", text: "Sukses" },
  "201": { color: "danger", text: "Dialihkan" },
  "64": { color: "danger", text: "Diabaikan" },
  "52": { color: "danger", text: "Tujuan Salah" },
  "40": { color: "danger", text: "Gagal" },
  "2": { color: "primary", text: "Menunggu Jawaban" },
  "69": { color: "danger", text: "Cutoff" },
  "50": { color: "danger", text: "Dibatalkan" },
  "3": { color: "danger", text: "Gagal Kirim" },
  "59": { color: "danger", text: "Harga Tidak Sesuai" },
  "0": { color: "warning", text: "Kirim Ulang" },
  "54": { color: "danger", text: "Area Tidak Cocok" },
  "56": { color: "danger", text: "Blacklist" },
  "58": { color: "danger", text: "Tidak Aktif" },
  "47": { color: "danger", text: "Produk Gangguan" },
  "200": { color: "warning", text: "Proses Ulang" },
  "61": { color: "danger", text: "QTY Tidak Sesuai" },
  "45": { color: "danger", text: "Stok Kosong" },
  "55": { color: "danger", text: "Timeout" },
  "46": { color: "danger", text: "Transaksi Dobel" },
  "53": { color: "danger", text: "Luar Wilayah" },
  "4": { color: "warning", text: "Tidak ada Parsing" },
};

const statusOptions = [
  { name: "Semua", uid: "all" },
  { name: "Sukses", uid: "20" },
  { name: "Gagal", uid: "40" },
  { name: "Sedang Proses", uid: "1" },
  { name: "Menunggu Jawaban", uid: "2" },
  { name: "Gagal Kirim", uid: "3" },
  { name: "Dibatalkan", uid: "50" },
  { name: "Tujuan Salah", uid: "52" },
  { name: "Tujuan Diluar Wilayah", uid: "53" },
  { name: "Timeout", uid: "55" },
  { name: "Nomor Tidak Aktif", uid: "58" },
];

export default function TransaksiPage() {
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
    dateRange,
    onDateChange,
    resetFilters, // <-- Ambil fungsi resetFilters
  } = useTransactions();

  const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(
    new Set(ALL_COLUMNS.map((c) => c.uid))
  );

  // State baru untuk melacak interaksi dengan filter status
  const [isStatusFilterTouched, setIsStatusFilterTouched] =
    React.useState(false);

  const headerColumns = React.useMemo(() => {
    return ALL_COLUMNS.filter((column) => visibleColumns.has(column.uid));
  }, [visibleColumns]);

  const renderCell = React.useCallback(
    (trx: Transaction, columnKey: React.Key) => {
      // ... (fungsi renderCell tetap sama)
      const cellValue = trx[columnKey as keyof Transaction];

      switch (columnKey) {
        case "kode":
          return <p className="text-sm font-mono">{cellValue}</p>;
        case "tgl_entri":
          const date = new Date(cellValue as string);
          // Opsi untuk format tanggal dan waktu dalam UTC
          const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
            timeZone: "UTC",
          };
          return (
            <p className="text-sm">
              {new Intl.DateTimeFormat("id-ID", options).format(date)}
            </p>
          );
        case "harga":
          return (
            <p className="text-sm">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(cellValue as number)}
            </p>
          );
        case "status":
          const statusInfo = statusColorMap[trx.status] || {
            color: "default",
            text: "Unknown",
          };
          return (
            <Chip color={statusInfo.color} size="sm" variant="flat">
              {statusInfo.text}
            </Chip>
          );
        case "sn":
          return (
            <p
              className="text-xs font-mono max-w-xs truncate"
              title={cellValue as string}
            >
              {cellValue || "N/A"}
            </p>
          );
        default:
          return <>{cellValue}</>;
      }
    },
    []
  );

  // Format tanggal untuk ditampilkan di tombol
  const formatDateRange = (range: RangeValue<DateValue> | null) => {
    if (!range) return "Pilih Tanggal";

    // Helper untuk memformat satu tanggal
    const format = (date: DateValue) => {
      // Ambil hari, bulan, dan tahun dari objek DateValue
      const day = String(date.day).padStart(2, "0");
      const month = String(date.month).padStart(2, "0");
      const year = date.year;

      return `${day}/${month}/${year}`;
    };

    const start = format(range.start);
    const end = format(range.end);

    return `${start} - ${end}`;
  };

  // Logika untuk menentukan teks pada tombol status
  const statusButtonText = React.useMemo(() => {
    // Jika belum pernah disentuh atau filternya 'Semua', tampilkan 'Status'
    if (!isStatusFilterTouched || statusFilter === "all") {
      return "Status";
    }
    // Jika sudah, cari nama status yang aktif
    return (
      statusOptions.find((status) => status.uid === statusFilter)?.name ||
      "Status"
    );
  }, [isStatusFilterTouched, statusFilter]);

  const topContent = React.useMemo(
    () => (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-xs"
            placeholder="Cari"
            startContent={<MagnifyingGlassIcon className="h-5 w-5" />}
            value={filterValue}
            onClear={() => onSearchChange("")}
            onValueChange={onSearchChange}
          />
          <div className="flex flex-wrap gap-3 items-end">
            {" "}
            {/* <-- Tambahkan items-end */}
            <Popover placement="bottom-start">
              <PopoverTrigger>
                <Button
                  variant="flat"
                  startContent={
                    <CalendarIcon className="h-4 w-4 text-default-500" />
                  }
                >
                  {formatDateRange(dateRange)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <RangeCalendar
                  aria-label="Date filter"
                  value={dateRange}
                  onChange={onDateChange}
                />
              </PopoverContent>
            </Popover>
            <Dropdown>
              <DropdownTrigger>
                {/* 3. Gunakan state baru untuk teks tombol */}
                <Button
                  endContent={<ChevronDownIcon className="h-4 w-4" />}
                  variant="flat"
                >
                  {statusButtonText}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Filter Status"
                closeOnSelect
                selectedKeys={new Set([statusFilter])}
                selectionMode="single"
                onAction={(key) => {
                  // 4. Panggil fungsi dari hook dan set state 'touched'
                  onStatusChange(key);
                  setIsStatusFilterTouched(true);
                }}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid}>{status.name}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  endContent={<ChevronDownIcon className="h-4 w-4" />}
                  variant="flat"
                >
                  Kolom
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Tampilkan Kolom"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns as any}
              >
                {ALL_COLUMNS.map((column) => (
                  <DropdownItem key={column.uid}>{column.name}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {/* --- TOMBOL RESET --- */}
            <Tooltip content="Reset Filter" placement="bottom">
              <Button
                isIconOnly
                variant="light"
                onPress={() => {
                  // 5. Panggil fungsi reset dari hook dan reset state 'touched'
                  resetFilters();
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
          Total {data?.totalItems || 0} transaksi.
        </span>
      </div>
    ),
    [
      filterValue,
      onSearchChange,
      statusFilter,
      onStatusChange,
      data?.totalItems,
      visibleColumns,
      dateRange,
      onDateChange,
      resetFilters,
    ]
  );

  const bottomContent = React.useMemo(() => {
    // ... (bottomContent tetap sama)
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {data?.totalItems
            ? `Halaman ${data.currentPage} dari ${data.totalPages}`
            : ""}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={data?.totalPages || 1}
          onChange={setPage}
        />
        <div className="w-[30%]" />
      </div>
    );
  }, [page, data?.totalItems, data?.currentPage, data?.totalPages, setPage]);

  return (
    <Table
      // ... (properti Tabel tetap sama)
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      topContent={topContent}
      topContentPlacement="outside"
      aria-label="Tabel Data Transaksi"
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn key={column.uid} allowsSorting={column.sortable}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        // ... (properti TableBody tetap sama)
        emptyContent={
          isLoading
            ? " "
            : isError
              ? "Gagal memuat data"
              : "Transaksi tidak ditemukan"
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
