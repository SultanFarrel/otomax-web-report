import { useState, useMemo } from "react";
import { Transaction } from "@/types";
import { useDownlineTransactions } from "@/hooks/useDownlineTransactions";
import { TransactionDetailModal } from "@/pages/transaction/components/transaction-detail-modal";
import { COLUMN_NAMES } from "./constants/downline-transactions-contants";
import { DownlineTransactionTableTopContent } from "./components/downline-transaction-table-top-content";
import { DownlineTransactionTableCellComponent } from "./components/downline-transaction-table-cell";
import { DownlineTransactionTableBottomContent } from "./components/downline-transaction-table-bottom-content";
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

export default function DownlineTransactionPage() {
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
  } = useDownlineTransactions();

  const [selectedTrx, setSelectedTrx] = useState<Transaction | null>(null);

  const topContent = useMemo(
    () => (
      <DownlineTransactionTableTopContent
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
      <DownlineTransactionTableBottomContent
        page={page}
        totalPages={data.totalPages}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
      />
    );
  }, [page, data.totalPages, setPage, pageSize, handlePageSizeChange]);

  const handleSortChange = (descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
    setPage(1);
  };

  return (
    <>
      <Table
        isStriped
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        topContent={topContent}
        topContentPlacement="outside"
        aria-label="Tabel Data Transaksi Downline"
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
                column.uid === "refid" ||
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
