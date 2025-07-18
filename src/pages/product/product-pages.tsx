import React from "react";

import { useProducts } from "@/hooks/useProducts";

import { COLUMN_NAMES } from "./constants/product-constants";
import { ProductTableCell } from "./components/product-table-cell";
import { ProductTableTopContent } from "./components/product-table-top-content";
import { ProductTableBottomContent } from "./components/product-table-bottom-content";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Spinner } from "@heroui/spinner";

export default function ProdukPage() {
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
    resetFilters,
  } = useProducts();

  const topContent = React.useMemo(
    () => (
      <ProductTableTopContent
        filterValue={filterValue}
        onSearchChange={onSearchChange}
        statusFilter={statusFilter}
        onStatusChange={onStatusChange}
        onResetFilters={resetFilters}
        totalItems={tableData?.totalItems || 0}
      />
    ),
    [
      filterValue,
      onSearchChange,
      statusFilter,
      onStatusChange,
      resetFilters,
      tableData?.totalItems,
    ]
  );

  const bottomContent = React.useMemo(() => {
    return (
      <ProductTableBottomContent
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

  return (
    <Table
      aria-label="Tabel data produk"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      topContent={topContent}
      topContentPlacement="outside"
    >
      <TableHeader columns={COLUMN_NAMES}>
        {(column) => (
          <TableColumn key={column.uid} align="start">
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
              : "Produk tidak ditemukan"
        }
        items={tableData?.data || []}
        isLoading={isTableLoading}
        loadingContent={<Spinner label="Memuat data..." />}
      >
        {(item) => (
          <TableRow key={item.kode}>
            {(columnKey) => (
              <TableCell>
                <ProductTableCell product={item} columnKey={columnKey} />
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
