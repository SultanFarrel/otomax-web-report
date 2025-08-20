import { useState, useMemo, useEffect, useCallback } from "react";
import { Transaction } from "@/types";
import { useDownlineTransactions } from "@/hooks/useDownlineTransactions";
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

const ITEMS_PER_LOAD = 20;

export default function DownlineTransactionPage() {
  const {
    allFetchedItems,
    isLoading,
    isError,
    inputValue,
    onSearchChange,
    inputLimit,
    onLimitChange,
    inputDateRange,
    onDateChange,
    onSearchSubmit,
    resetFilters,
    statusFilter,
    onStatusChange,
    sortDescriptor,
    setSortDescriptor,
  } = useDownlineTransactions();

  const [visibleItemCount, setVisibleItemCount] = useState(ITEMS_PER_LOAD);
  const [isClientLoading, setIsClientLoading] = useState(false);

  useEffect(() => {
    setVisibleItemCount(ITEMS_PER_LOAD);
  }, [allFetchedItems]);

  const itemsToDisplay = useMemo(
    () => allFetchedItems.slice(0, visibleItemCount),
    [allFetchedItems, visibleItemCount]
  );

  const handleLoadMore = useCallback(() => {
    setIsClientLoading(true);
    setTimeout(() => {
      setVisibleItemCount((prev) =>
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

  const topContent = useMemo(
    () => (
      <DownlineTransactionTableTopContent
        filterValue={inputValue}
        onSearchChange={onSearchChange}
        dateRange={inputDateRange}
        onDateChange={onDateChange}
        limit={inputLimit}
        onLimitChange={onLimitChange}
        onSearchSubmit={onSearchSubmit}
        statusFilter={statusFilter}
        onStatusChange={onStatusChange}
        visibleColumns={visibleColumns}
        onVisibleColumnsChange={setVisibleColumns as any}
        onResetFilters={resetFilters}
        totalItems={allFetchedItems.length}
      />
    ),
    [
      inputValue,
      onSearchChange,
      inputDateRange,
      onDateChange,
      inputLimit,
      onLimitChange,
      onSearchSubmit,
      statusFilter,
      onStatusChange,
      visibleColumns,
      resetFilters,
      allFetchedItems.length,
    ]
  );

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
        classNames={{
          wrapper: "max-h-[600px] p-0 ps-2 overflow-y-auto stable-scrollbar",
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
          items={itemsToDisplay}
          isLoading={isLoading}
          loadingContent={<Spinner label="Memuat data..." />}
          emptyContent={
            isError ? "Gagal memuat data" : "Transaksi tidak ditemukan"
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
