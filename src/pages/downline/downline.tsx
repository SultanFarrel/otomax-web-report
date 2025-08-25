// sultanfarrel/otomax-web-report/otomax-web-report-new-api/src/pages/downline/downline.tsx
import React from "react";
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

export default function DownlinePage() {
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
    onResetFilters,
    sortDescriptor,
    setSortDescriptor,
  } = useDownlines();

  const topContent = React.useMemo(
    () => (
      <DownlineTableTopContent
        filters={inputFilters}
        onFilterChange={handleFilterChange}
        onSearchSubmit={onSearchSubmit}
        onResetFilters={onResetFilters}
        totalItems={tableData?.totalItems || 0}
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
      />
    ),
    [page, tableData?.totalPages, setPage, pageSize, handlePageSizeChange]
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
              align={column.uid === "actions" ? "end" : "start"}
              allowsSorting={column.sortable}
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
                  <DownlineTableCell downline={item} columnKey={columnKey} />
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
