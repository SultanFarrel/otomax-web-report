import { useState, useMemo, useEffect, useCallback } from "react";
import { useBalanceMutation } from "@/hooks/useBalanceMutation";
import { COLUMN_NAMES } from "./constants/balance-mutation-constants";
import { BalanceMutationTableTopContent } from "./components/balance-mutation-table-top-content";
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
import { Button } from "@heroui/button";
import { SortDescriptor } from "@heroui/table";

const ITEMS_PER_LOAD = 20;

export default function BalanceMutationPage() {
  const {
    allFetchedItems,
    isLoading,
    isError,
    filterValue,
    onSearchChange,
    dateRange,
    onDateChange,
    resetFilters,
    sortDescriptor,
    setSortDescriptor,
  } = useBalanceMutation();

  const [visibleItemCount, setVisibleItemCount] = useState(ITEMS_PER_LOAD);
  const [isClientLoading, setIsClientLoading] = useState(false);

  useEffect(() => {
    setVisibleItemCount(ITEMS_PER_LOAD);
  }, [allFetchedItems]);

  const itemsToDisplay = useMemo(
    () => allFetchedItems.slice(0, visibleItemCount),
    [allFetchedItems, visibleItemCount]
  );

  const handleLoadMore = useCallback(() => {
    setIsClientLoading(true);
    // Simulasi loading agar spinner terlihat
    setTimeout(() => {
      setVisibleItemCount((prev) =>
        // Pastikan tidak melebihi total item yang ada
        Math.min(prev + ITEMS_PER_LOAD, allFetchedItems.length)
      );
      setIsClientLoading(false);
    }, 300);
  }, [allFetchedItems.length]);

  const canLoadMore = visibleItemCount < allFetchedItems.length;

  const topContent = useMemo(
    () => (
      <BalanceMutationTableTopContent
        filterValue={filterValue}
        onSearchChange={onSearchChange}
        dateRange={dateRange}
        onDateChange={onDateChange}
        onResetFilters={resetFilters}
        totalItems={itemsToDisplay.length}
      />
    ),
    [
      filterValue,
      onSearchChange,
      dateRange,
      onDateChange,
      resetFilters,
      itemsToDisplay.length,
    ]
  );

  const bottomContent = useMemo(() => {
    if (!canLoadMore) return null;
    return (
      <div className="flex w-full justify-center py-4">
        <Button
          isLoading={isClientLoading}
          onPress={handleLoadMore}
          variant="flat"
        >
          Tampilkan Lebih Banyak
        </Button>
      </div>
    );
  }, [canLoadMore, isClientLoading, handleLoadMore]);

  const handleSortChange = (descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
  };

  return (
    <Table
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      topContent={topContent}
      topContentPlacement="outside"
      aria-label="Tabel Data Mutasi Saldo"
      sortDescriptor={sortDescriptor}
      onSortChange={handleSortChange}
      classNames={{
        wrapper: "max-h-[600px] overflow-y-auto p-0",
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
