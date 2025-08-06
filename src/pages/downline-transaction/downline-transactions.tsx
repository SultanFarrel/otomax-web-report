import { useState, useMemo, useEffect, useCallback } from "react";
import { Transaction } from "@/types";
import { useDownlineTransactions } from "@/hooks/useDownlineTransactions"; // Hook Anda yang sudah diupdate
import { TransactionDetailModal } from "@/pages/transaction/components/transaction-detail-modal";
import { COLUMN_NAMES } from "./constants/downline-transactions-contants";
import { DownlineTransactionTableTopContent } from "./components/downline-transaction-table-top-content";
import { DownlineTransactionTableCellComponent } from "./components/downline-transaction-table-cell";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Spinner } from "@heroui/spinner";
import { Button } from "@heroui/button";
import { SortDescriptor } from "@heroui/table";

// Jumlah item yang akan ditampilkan setiap kali menekan "load more"
const ITEMS_PER_LOAD = 20;

export default function DownlineTransactionPage() {
  // 1. Destrukturisasi hook baru Anda
  const {
    allFetchedItems,
    isLoading,
    isError,
    filterValue,
    onSearchChange,
    statusFilter,
    onStatusChange,
    dateRange,
    onDateChange,
    resetFilters,
    sortDescriptor,
    setSortDescriptor,
  } = useDownlineTransactions();

  // 2. Tambahkan state untuk mengelola tampilan di client
  const [visibleItemCount, setVisibleItemCount] = useState(ITEMS_PER_LOAD);
  const [isClientLoading, setIsClientLoading] = useState(false);

  // Reset tampilan jika filter berubah
  useEffect(() => {
    setVisibleItemCount(ITEMS_PER_LOAD);
  }, [allFetchedItems]);

  // Buat array yang hanya berisi item yang akan ditampilkan
  const itemsToDisplay = useMemo(
    () => allFetchedItems.slice(0, visibleItemCount),
    [allFetchedItems, visibleItemCount]
  );

  // 3. Buat fungsi handleLoadMore
  const handleLoadMore = useCallback(() => {
    setIsClientLoading(true);
    // Simulasi loading agar spinner terlihat
    setTimeout(() => {
      setVisibleItemCount((prev) =>
        // Pastikan tidak melebihi total item yang ada
        Math.min(prev + ITEMS_PER_LOAD, allFetchedItems.length)
      );
      setIsClientLoading(false);
    }, 300);
  }, [allFetchedItems.length]);

  const canLoadMore = visibleItemCount < allFetchedItems.length;

  const [selectedTrx, setSelectedTrx] = useState<Transaction | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(COLUMN_NAMES.map((c) => c.uid))
  );

  const headerColumns = useMemo(() => {
    return COLUMN_NAMES.filter((column) => visibleColumns.has(column.uid));
  }, [visibleColumns]);

  // 4. Update topContent untuk menggunakan panjang data yang ditampilkan
  const topContent = useMemo(
    () => (
      <DownlineTransactionTableTopContent
        filterValue={filterValue}
        onSearchChange={onSearchChange}
        statusFilter={statusFilter}
        onStatusChange={onStatusChange}
        dateRange={dateRange}
        onDateChange={onDateChange}
        visibleColumns={visibleColumns}
        onVisibleColumnsChange={setVisibleColumns as any}
        onResetFilters={resetFilters}
        totalItems={itemsToDisplay.length} // Update ini
      />
    ),
    [
      filterValue,
      onSearchChange,
      statusFilter,
      onStatusChange,
      dateRange,
      onDateChange,
      visibleColumns,
      resetFilters,
      itemsToDisplay.length, // Update ini
    ]
  );

  // 5. Ganti bottomContent dari paginasi menjadi tombol "Load More"
  const bottomContent = useMemo(() => {
    if (!canLoadMore) return null;

    return (
      <div className="flex w-full justify-center py-4">
        <Button
          isLoading={isClientLoading}
          onPress={handleLoadMore}
          variant="flat"
        >
          Tampilkan Lebih Banyak
        </Button>
      </div>
    );
  }, [canLoadMore, isClientLoading, handleLoadMore]);

  // Handler sort tidak perlu setPage lagi
  const handleSortChange = (descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
  };

  return (
    <>
      <Table
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        topContent={topContent}
        topContentPlacement="outside"
        aria-label="Tabel Data Transaksi Downline"
        sortDescriptor={sortDescriptor}
        onSortChange={handleSortChange}
        // 6. Tambahkan classNames untuk scroll & styling
        classNames={{
          wrapper: "max-h-[600px] overflow-y-auto p-0",
        }}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "end" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          // 7. Update props untuk TableBody
          items={itemsToDisplay}
          isLoading={isLoading} // Hanya untuk loading awal
          loadingContent={<Spinner label="Memuat data..." />}
          emptyContent={
            !isLoading && isError
              ? "Gagal memuat data"
              : "Transaksi tidak ditemukan"
          }
        >
          {(item) => (
            <TableRow key={item.kode}>
              {(columnKey) => (
                <TableCell>
                  <DownlineTransactionTableCellComponent
                    trx={item}
                    columnKey={columnKey}
                    onViewDetails={setSelectedTrx}
                  />
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <TransactionDetailModal
        trx={selectedTrx}
        onClose={() => setSelectedTrx(null)}
      />
    </>
  );
}
