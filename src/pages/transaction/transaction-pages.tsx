import React, { useState } from "react";

import { Transaction } from "@/types";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionDetailModal } from "@/pages/transaction/components/transaction-detail-modal";
import { TransactionReceipt } from "@/pages/transaction/components/transaction-receipt";

import { COLUMN_NAMES } from "./constants/transaction-constants";
import { TransactionTableTopContent } from "./components/transaction-table-top-content";
import { TransactionTableBottomContent } from "./components/transaction-table-bottom-content";
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

export default function TransactionPage() {
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
    sortDescriptor,
    setSortDescriptor,
  } = useTransactions();

  const [selectedTrx, setSelectedTrx] = useState<Transaction | null>(null);
  const [trxToPrint, setTrxToPrint] = useState<Transaction | null>(null);

  const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(
    new Set(COLUMN_NAMES.map((c) => c.uid))
  );

  const headerColumns = React.useMemo(() => {
    return COLUMN_NAMES.filter((column) => visibleColumns.has(column.uid));
  }, [visibleColumns]);

  const handlePrint = (trx: Transaction) => {
    setTrxToPrint(trx);
    setTimeout(() => {
      window.print();
      setTrxToPrint(null);
    }, 100);
  };

  const topContent = React.useMemo(
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
      <TransactionTableBottomContent
        page={page}
        totalItems={tableData?.totalItems || 0}
        currentPage={tableData?.currentPage || 1}
        totalPages={tableData?.totalPages || 1}
        onPageChange={setPage}
      />
    );
  }, [
    page,
    tableData?.totalItems,
    tableData?.currentPage,
    tableData?.totalPages,
    setPage,
  ]);

  const handleSortChange = (descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
    setPage(1);
  };

  return (
    <>
      <div className="printable-area">
        <TransactionReceipt transaction={trxToPrint} />
      </div>
      <div className="main-content">
        <Table
          isHeaderSticky
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          topContent={topContent}
          topContentPlacement="outside"
          aria-label="Tabel Data Transaksi"
          sortDescriptor={sortDescriptor}
          onSortChange={handleSortChange}
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
