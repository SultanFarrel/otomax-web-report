// src/pages/transaksi-downline.tsx

import React from "react";
import { Transaction } from "@/types";
import { useDownlineTransactions } from "@/hooks/useDownlineTransactions";
import { TransactionDetailModal } from "@/pages/transaction/components/transaction-detail-modal";
import { COLUMN_NAMES } from "./constants/downline-transactions-contants";
import { DownlineTransactionTableTopContent } from "./components/downline-transaction-table-top-content";
import { DownlineTransactionTableBottomContent } from "./components/downline-transaction-table-bottom-content";
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

export default function DownlineTransactionPage() {
  const {
    data: tableData,
    isLoading: isTableLoading,
    isError: isTableError,
    page,
    setPage,
    filterValue,
    onSearchChange,
    statusFilter,
    onStatusChange,
    dateRange,
    onDateChange,
    resetFilters,
  } = useDownlineTransactions();

  const [selectedTrx, setSelectedTrx] = React.useState<Transaction | null>(
    null
  );

  const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(
    new Set(COLUMN_NAMES.map((c) => c.uid))
  );

  const headerColumns = React.useMemo(() => {
    return COLUMN_NAMES.filter((column) => visibleColumns.has(column.uid));
  }, [visibleColumns]);

  const topContent = React.useMemo(
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
        totalItems={tableData?.totalItems || 0}
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
      tableData?.totalItems,
    ]
  );

  const bottomContent = React.useMemo(() => {
    return (
      <DownlineTransactionTableBottomContent
        page={page}
        totalPages={tableData?.totalPages || 1}
        onPageChange={setPage}
      />
    );
  }, [page, tableData?.totalPages, setPage]);

  return (
    <>
      <Table
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        topContent={topContent}
        topContentPlacement="outside"
        aria-label="Tabel Data Transaksi Downline"
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              allowsSorting={column.sortable}
              align={column.uid === "actions" ? "end" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={
            isTableLoading
              ? " "
              : isTableError
                ? "Gagal memuat data"
                : "Transaksi tidak ditemukan"
          }
          items={tableData?.data || []}
          isLoading={isTableLoading}
          loadingContent={<Spinner label="Memuat data..." />}
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
