import React from "react";
import { useLocation } from "react-router-dom";
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

import { useDownlines } from "@/hooks/useDownlines";
import { COLUMN_NAMES } from "./constants/downline-constants";
import { DownlineTableCell } from "./components/downline-table-cell";
import { DownlineTableTopContent } from "./components/downline-table-top-content";
import { DownlineTableBottomContent } from "./components/downline-table-bottom-content";
import { exportToExcel } from "@/utils/exportToExcel";
import { formatDate } from "@/utils/formatters";
import { Downline } from "@/types";

const getDownlineStatus = (downline: Downline): string => {
  if (downline.suspend) return "Suspend";
  if (downline.aktif) return "Aktif";
  return "Nonaktif";
};

export default function DownlinePage() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/adm");

  const {
    data: tableData,
    allData,
    hasKomisi,
    isLoading: isTableLoading,
    isError: isTableError,
    page,
    setPage,
    pageSize,
    handlePageSizeChange,
    inputFilters,
    handleFilterChange,
    onSearchSubmit,
    onResetFilters,
    sortDescriptor,
    setSortDescriptor,
  } = useDownlines({ isAdmin });

  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const dataToExport = allData.map((downline) => ({
        Kode: downline.kode,
        Nama: downline.nama,
        Saldo: downline.saldo,
        Komisi: downline.komisi,
        Poin: downline.poin,
        Status: getDownlineStatus(downline),
        "Kode Upline": downline.kode_upline,
        Markup: downline.markup,
        "Tgl Daftar": formatDate(downline.tgl_daftar),
        "Aktivitas Terakhir": downline.tgl_aktivitas
          ? formatDate(downline.tgl_aktivitas)
          : "-",
      }));
      exportToExcel(dataToExport, "Laporan Downline");
      setIsExporting(false);
    }, 500);
  };

  const topContent = React.useMemo(
    () => (
      <DownlineTableTopContent
        filters={inputFilters}
        onFilterChange={handleFilterChange}
        onSearchSubmit={onSearchSubmit}
        onResetFilters={onResetFilters}
        totalItems={tableData?.totalItems || 0}
        isAdmin={isAdmin}
      />
    ),
    [
      inputFilters,
      handleFilterChange,
      onSearchSubmit,
      onResetFilters,
      tableData?.totalItems,
    ]
  );

  const bottomContent = React.useMemo(
    () => (
      <DownlineTableBottomContent
        page={page}
        totalPages={tableData?.totalPages || 1}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        onExport={handleExport}
        isExporting={isExporting}
      />
    ),
    [
      page,
      tableData?.totalPages,
      setPage,
      pageSize,
      handlePageSizeChange,
      isExporting,
      allData,
    ]
  );

  const handleSortChange = (descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-8">
      <Table
        isStriped
        isHeaderSticky
        aria-label="Tabel Data Downline"
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
                column.uid === "saldo" ||
                column.uid === "poin" ||
                column.uid === "komisi" ||
                column.uid === "markup"
                  ? "end"
                  : column.uid === "status" ||
                      column.uid === "tgl_daftar" ||
                      column.uid === "tgl_aktivitas"
                    ? "center"
                    : "start"
              }
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={tableData?.data || []}
          isLoading={isTableLoading}
          loadingContent={<Spinner label="Memuat data..." />}
          emptyContent={
            isTableError ? "Gagal memuat data" : "Downline tidak ditemukan"
          }
        >
          {(item) => (
            <TableRow key={item.kode}>
              {(columnKey) => (
                <TableCell>
                  <DownlineTableCell
                    downline={item}
                    columnKey={columnKey}
                    hasKomisi={hasKomisi}
                  />
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
