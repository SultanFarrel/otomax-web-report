// src/pages/balance-mutation.tsx

import React from "react";
import { useBalanceMutation } from "@/hooks/useBalanceMutation";
import { COLUMN_NAMES } from "./constants/balance-mutation-constants";
import { BalanceMutationTableTopContent } from "./components/balance-mutation-table-top-content";
import { BalanceMutationTableBottomContent } from "./components/balance-mutation-table-bottom-contents";
import { BalanceMutationTableCellComponent } from "./components/balance-mutation-table-cell";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Spinner } from "@heroui/spinner";

export default function BalanceMutationPage() {
  const {
    data: tableData,
    isLoading: isTableLoading,
    isError: isTableError,
    page,
    setPage,
    filterValue,
    onSearchChange,
    dateRange,
    onDateChange,
    resetFilters,
  } = useBalanceMutation();

  const topContent = React.useMemo(
    () => (
      <BalanceMutationTableTopContent
        filterValue={filterValue}
        onSearchChange={onSearchChange}
        dateRange={dateRange}
        onDateChange={onDateChange}
        onResetFilters={resetFilters}
        totalItems={tableData?.totalItems || 0}
      />
    ),
    [
      filterValue,
      onSearchChange,
      dateRange,
      onDateChange,
      resetFilters,
      tableData?.totalItems,
    ]
  );

  const bottomContent = React.useMemo(() => {
    return (
      <BalanceMutationTableBottomContent
        page={page}
        totalPages={tableData?.totalPages || 1}
        onPageChange={setPage}
      />
    );
  }, [page, tableData?.totalPages, setPage]);

  return (
    <Table
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      topContent={topContent}
      topContentPlacement="outside"
      aria-label="Tabel Data Mutasi Saldo"
    >
      <TableHeader columns={COLUMN_NAMES}>
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
              : "Mutasi tidak ditemukan"
        }
        items={tableData?.data || []}
        isLoading={isTableLoading}
        loadingContent={<Spinner label="Memuat data..." />}
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
