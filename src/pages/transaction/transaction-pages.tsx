import { useState, useMemo } from "react";

import { Transaction } from "@/types";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionDetailModal } from "@/pages/transaction/components/transaction-detail-modal";
import { TransactionReceipt } from "@/pages/transaction/components/transaction-receipt";

import { COLUMN_NAMES } from "./constants/transaction-constants";
import { TransactionTableTopContent } from "./components/transaction-table-top-content";
import { TransactionTableCell } from "./components/transaction-table-cell";
import { TransactionTableBottomContent } from "./components/transaction-table-bottom-content";

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
    data,
    transactionSummary,
    isLoading,
    isError,
    page,
    setPage,
    pageSize,
    handlePageSizeChange,
    inputFilters,
    handleFilterChange,
    onSearchSubmit,
    resetFilters,
    sortDescriptor,
    setSortDescriptor,
  } = useTransactions();

  const [selectedTrx, setSelectedTrx] = useState<Transaction | null>(null);
  const [trxToPrint, setTrxToPrint] = useState<Transaction | null>(null);

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
        filters={inputFilters}
        onFilterChange={handleFilterChange}
        onSearchSubmit={onSearchSubmit}
        onResetFilters={resetFilters}
        totalItems={data?.totalItems || 0}
        summary={transactionSummary}
      />
    ),
    [
      inputFilters,
      handleFilterChange,
      onSearchSubmit,
      resetFilters,
      data?.totalItems,
      transactionSummary,
    ]
  );

  const bottomContent = useMemo(() => {
    if (!data) return null;
    return (
      <TransactionTableBottomContent
        page={page}
        totalPages={data.totalPages}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
      />
    );
  }, [page, data?.totalPages, setPage, pageSize, handlePageSizeChange]);

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
          isStriped
          isHeaderSticky
          aria-label="Tabel Data Transaksi"
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          topContent={topContent}
          topContentPlacement="outside"
          sortDescriptor={sortDescriptor}
          onSortChange={handleSortChange}
          classNames={{
            wrapper: "max-h-[565px] p-0 ps-2 overflow-y-auto stable-scrollbar",
          }}
        >
          <TableHeader columns={COLUMN_NAMES}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={
                  column.uid === "actions" ||
                  column.uid === "kode" ||
                  column.uid === "ref_id" ||
                  column.uid === "harga"
                    ? "end"
                    : column.uid === "status" ||
                        column.uid === "tgl_entri" ||
                        column.uid === "tgl_status"
                      ? "center"
                      : "start"
                }
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={data?.data ?? []}
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
