import { useState, useMemo, useCallback } from "react";
import { useBalanceMutation } from "@/hooks/useBalanceMutation";
import {
  COLUMN_NAMES,
  ADMIN_COLUMN_NAMES,
} from "./constants/balance-mutation-constants";
import { BalanceMutationTableTopContent } from "./components/balance-mutation-table-top-content";
import { BalanceMutationTableCellComponent } from "./components/balance-mutation-table-cell";
import { BalanceMutationTableBottomContent } from "./components/balance-mutation-table-bottom-content";
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
import { exportToExcel } from "@/utils/exportToExcel";
import { formatDate } from "@/utils/formatters";
import { useLocation } from "react-router-dom";

export default function BalanceMutationPage() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/adm");

  const {
    allFetchedItems,
    totalItems,
    mutationSummary,
    isLoading,
    isError,
    inputFilters,
    handleFilterChange,
    onSearchSubmit,
    resetFilters,
    sortDescriptor,
    setSortDescriptor,
  } = useBalanceMutation({ isAdmin });

  const columnNames = isAdmin ? ADMIN_COLUMN_NAMES : COLUMN_NAMES;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isExporting, setIsExporting] = useState(false);

  const pages = Math.ceil(totalItems / pageSize);

  const itemsToDisplay = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return allFetchedItems.slice(start, end);
  }, [page, pageSize, allFetchedItems]);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, []);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const dataToExport = allFetchedItems.map((mutation) => ({
        Tanggal: formatDate(mutation.tanggal),
        Keterangan: mutation.keterangan,
        Jumlah: mutation.jumlah,
        "Saldo Akhir": mutation.saldo_akhir,
      }));
      exportToExcel(dataToExport, "Laporan Mutasi Saldo");
      setIsExporting(false);
    }, 500);
  };

  const topContent = useMemo(
    () => (
      <BalanceMutationTableTopContent
        filters={inputFilters}
        onFilterChange={handleFilterChange}
        onSearchSubmit={onSearchSubmit}
        onResetFilters={resetFilters}
        totalItems={totalItems}
        summary={mutationSummary}
        isAdmin={isAdmin}
      />
    ),
    [
      inputFilters,
      handleFilterChange,
      onSearchSubmit,
      resetFilters,
      totalItems,
      mutationSummary,
      isAdmin,
    ]
  );

  const bottomContent = useMemo(() => {
    return (
      <BalanceMutationTableBottomContent
        page={page}
        totalPages={pages}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        onExport={handleExport}
        isExporting={isExporting}
      />
    );
  }, [
    page,
    pages,
    pageSize,
    handlePageSizeChange,
    isExporting,
    allFetchedItems,
  ]);

  const handleSortChange = (descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
  };

  return (
    <Table
      isStriped
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      topContent={topContent}
      topContentPlacement="outside"
      aria-label="Tabel Data Mutasi Saldo"
      sortDescriptor={sortDescriptor}
      onSortChange={handleSortChange}
      classNames={{
        wrapper: "max-h-[480px] overflow-y-auto p-0",
      }}
    >
      <TableHeader columns={columnNames}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={
              column.uid === "actions" ||
              column.uid === "jumlah" ||
              column.uid === "saldo_akhir"
                ? "end"
                : "start"
            }
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
          !isLoading && isError ? "Gagal memuat data" : "Mutasi tidak ditemukan"
        }
      >
        {(item) => (
          <TableRow key={item.kode}>
            {(columnKey) => (
              <TableCell>
                <BalanceMutationTableCellComponent
                  mutation={item}
                  columnKey={columnKey}
                />
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
