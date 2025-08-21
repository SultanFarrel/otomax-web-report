import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/store/userStore";
import { apiClient } from "@/api/axios";
import { Downline } from "@/types";
import { DownlineNode } from "@/components/downline-node";
import { Spinner } from "@heroui/spinner";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { SortDescriptor } from "@heroui/table";

import { useDownlines } from "@/hooks/useDownlines";
import { COLUMN_NAMES } from "./constants/downline-constants";
import { DownlineTableCell } from "./components/downline-table-cell";
import { DownlineTableTopContent } from "./components/downline-table-top-content";
import { DownlineTableBottomContent } from "./components/downline-table-bottom-content";

const fetchTopLevelDownlines = async (
  uplineKode: string
): Promise<Downline[]> => {
  const { data } = await apiClient.get(`/reseller/upline/${uplineKode}`);
  return data.data;
};

export default function DownlinePage() {
  const user = useUserStore((state) => state.user);

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
    sortDescriptor,
    setSortDescriptor,
  } = useDownlines();

  const {
    data: treeData,
    isLoading: isTreeLoading,
    isError: isTreeError,
  } = useQuery({
    queryKey: ["topLevelDownlines", user?.kode],
    queryFn: () => fetchTopLevelDownlines(user!.kode),
    enabled: !!user?.kode,
  });

  const topContent = React.useMemo(
    () => (
      <DownlineTableTopContent
        filterValue={filterValue}
        onSearchChange={onSearchChange}
        statusFilter={statusFilter}
        onStatusChange={onStatusChange}
        totalItems={tableData?.totalItems || 0}
      />
    ),
    [
      filterValue,
      onSearchChange,
      statusFilter,
      onStatusChange,
      tableData?.totalItems,
    ]
  );

  const bottomContent = React.useMemo(
    () => (
      <DownlineTableBottomContent
        page={page}
        totalPages={tableData?.totalPages || 1}
        onPageChange={setPage}
      />
    ),
    [page, tableData?.totalPages, setPage]
  );

  const handleSortChange = (descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Bagian Tabel */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Daftar Downline</h1>
        <Table
          aria-label="Tabel data downline"
          isHeaderSticky
          topContent={topContent}
          topContentPlacement="outside"
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          sortDescriptor={sortDescriptor}
          onSortChange={handleSortChange}
        >
          <TableHeader columns={COLUMN_NAMES}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "total_downline" ? "center" : "start"}
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={tableData?.data || []}
            isLoading={isTableLoading}
            loadingContent={<Spinner label="Memuat data tabel..." />}
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

      {/* Bagian Pohon Jaringan */}
      <div>
        <h1 className="text-2xl font-bold">Struktur Jaringan</h1>
        {isTreeLoading && (
          <div className="flex justify-center items-center h-full mt-4">
            <Spinner label="Memuat struktur jaringan..." size="lg" />
          </div>
        )}
        {isTreeError && (
          <p className="text-center text-danger mt-4">
            Gagal memuat struktur jaringan.
          </p>
        )}
        {treeData && treeData.length > 0
          ? treeData.map((downline) => (
              <DownlineNode key={downline.kode} downline={downline} level={0} />
            ))
          : !isTreeLoading && (
              <p className="mt-4">Anda tidak memiliki downline.</p>
            )}
      </div>
    </div>
  );
}
