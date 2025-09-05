import { useState, useMemo } from "react";

import { Transaction } from "@/types";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionDetailModal } from "@/pages/transaction/components/transaction-detail-modal";
import { TransactionReceipt } from "@/pages/transaction/components/transaction-receipt";
import { exportToExcel } from "@/utils/exportToExcel";
import { formatDate } from "@/utils/formatters";
import { STATUS_COLORS } from "./constants/transaction-constants";

import {
  USER_COLUMN_NAMES,
  ADMIN_DOWNLINE_COLUMN_NAMES,
} from "./constants/transaction-constants";
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
import { useLocation } from "react-router-dom";

export default function TransactionPage() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/adm");
  const isDownline = location.pathname.includes("/transaksi-downline");

  const {
    data,
    allData,
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
  } = useTransactions({ isAdmin, isDownline });

  const [selectedTrx, setSelectedTrx] = useState<Transaction | null>(null);
  const [trxToPrint, setTrxToPrint] = useState<Transaction | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const columnNames =
    isAdmin || isDownline ? ADMIN_DOWNLINE_COLUMN_NAMES : USER_COLUMN_NAMES;
  const exportFileName = isDownline
    ? "Laporan Transaksi Downline"
    : "Laporan Transaksi";

  const handlePrint = (trx: Transaction) => {
    setTrxToPrint(trx);
    setTimeout(() => {
      window.print();
      setTrxToPrint(null);
    }, 100);
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const dataToExport = allData.map((trx) => {
        const statusInfo = STATUS_COLORS[trx.status] || {
          text: `Kode ${trx.status}`,
        };
        const baseData: any = {
          "TRX ID": trx.kode,
          "Ref ID": trx.ref_id,
          "Tgl TRX": formatDate(trx.tgl_entri),
        };
        // Tambahkan kolom Agen jika perlu
        if (isAdmin || isDownline) {
          baseData["Agen"] = trx.kode_reseller;
        }
        Object.assign(baseData, {
          Produk: trx.kode_produk,
          Tujuan: trx.tujuan,
          Harga: trx.harga,
          Status: statusInfo.text,
          SN: trx.sn,
          Pengirim: trx.pengirim,
          "Tgl Status": trx.tgl_status ? formatDate(trx.tgl_status) : "-",
        });
        return baseData;
      });
      exportToExcel(dataToExport, exportFileName);
      setIsExporting(false);
    }, 500);
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
        showAgentFilter={isAdmin || isDownline}
      />
    ),
    [
      inputFilters,
      handleFilterChange,
      onSearchSubmit,
      resetFilters,
      data?.totalItems,
      transactionSummary,
      isAdmin,
      isDownline,
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
        onExport={handleExport}
        isExporting={isExporting} // <-- Pass state loading
      />
    );
  }, [
    page,
    data?.totalPages,
    setPage,
    pageSize,
    handlePageSizeChange,
    allData,
    isExporting,
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
          <TableHeader columns={columnNames}>
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
