import { useState, useMemo, useEffect, useCallback } from "react";

import { Transaction } from "@/types";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionDetailModal } from "@/pages/transaction/components/transaction-detail-modal";
import { TransactionReceipt } from "@/pages/transaction/components/transaction-receipt";

import { COLUMN_NAMES } from "./constants/transaction-constants";
import { TransactionTableTopContent } from "./components/transaction-table-top-content";
import { TransactionTableCell } from "./components/transaction-table-cell";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Spinner } from "@heroui/spinner";
import { SortDescriptor } from "@heroui/table";
import { Button } from "@heroui/button";

const ITEMS_PER_LOAD = 20;

export default function TransactionPage() {
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
    limit,
    onLimitChange,
  } = useTransactions();

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
  const [trxToPrint, setTrxToPrint] = useState<Transaction | null>(null);

  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(COLUMN_NAMES.map((c) => c.uid))
  );

  const headerColumns = useMemo(() => {
    return COLUMN_NAMES.filter((column) => visibleColumns.has(column.uid));
  }, [visibleColumns]);

  const handlePrint = (trx: Transaction) => {
    setTrxToPrint(trx);
    setTimeout(() => {
      window.print();
      setTrxToPrint(null);
    }, 100);
  };

  const topContent = useMemo(
    () => (
      <TransactionTableTopContent
        filterValue={filterValue}
        onSearchChange={onSearchChange}
        statusFilter={statusFilter}
        onStatusChange={onStatusChange}
        dateRange={dateRange}
        onDateChange={onDateChange}
        visibleColumns={visibleColumns}
        onVisibleColumnsChange={setVisibleColumns as any}
        onResetFilters={resetFilters}
        totalItems={allFetchedItems.length}
        limit={limit}
        onLimitChange={onLimitChange}
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
      allFetchedItems.length,
      limit,
      onLimitChange,
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
      <div className="printable-area">
        <TransactionReceipt transaction={trxToPrint} />
      </div>
      <div className="main-content">
        <Table
          isHeaderSticky
          aria-label="Tabel Data Transaksi"
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          topContent={topContent}
          topContentPlacement="outside"
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
                    <TransactionTableCell
                      trx={item}
                      columnKey={columnKey}
                      onViewDetails={setSelectedTrx}
                      onPrint={handlePrint}
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
      </div>
    </>
  );
}
