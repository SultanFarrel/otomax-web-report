// sultanfarrel/otomax-web-report/otomax-web-report-new-api/src/pages/product/product-pages.tsx
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
import { SortDescriptor } from "@heroui/table";

export default function ProdukPage() {
  const {
    data: tableData,
    isLoading: isTableLoading,
    isError: isTableError,
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
  } = useProducts();

  const topContent = React.useMemo(
    () => (
      <ProductTableTopContent
        filters={inputFilters}
        onFilterChange={handleFilterChange}
        onSearchSubmit={onSearchSubmit}
        onResetFilters={resetFilters}
        totalItems={tableData?.totalItems || 0}
      />
    ),
    [
      inputFilters,
      handleFilterChange,
      onSearchSubmit,
      resetFilters,
      tableData?.totalItems,
    ]
  );

  const bottomContent = React.useMemo(() => {
    return (
      <ProductTableBottomContent
        page={page}
        totalPages={tableData?.totalPages || 1}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
      />
    );
  }, [page, tableData?.totalPages, setPage, pageSize, handlePageSizeChange]);

  const handleSortChange = (descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
    setPage(1);
  };

  return (
    <Table
      isStriped
      aria-label="Tabel data produk"
      isHeaderSticky
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
              column.uid === "harga_beli" || column.uid === "harga_jual"
                ? "end"
                : column.uid === "status"
                  ? "center"
                  : "start"
            }
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
