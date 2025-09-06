import React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Spinner } from "@heroui/spinner";
import { useDatabaseStats } from "@/hooks/dashboard/useDatabaseStats";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";

export const DatabaseInfoCard: React.FC = () => {
  const { data, isLoading, error, refetch, isFetching } = useDatabaseStats();

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Informasi Database</h3>
          <p className="text-sm text-default-500">
            Ukuran dan jumlah data pada tabel utama.
          </p>
        </div>
        <Tooltip content="Refresh Data">
          <Button
            isIconOnly
            variant="light"
            onPress={() => refetch()}
            isLoading={isFetching}
          >
            <ArrowPathIcon className="h-5 w-5" />
          </Button>
        </Tooltip>
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <Spinner label="Memuat informasi database..." />
        ) : error ? (
          <p className="text-danger">
            {error?.message?.trim() ? error.message : "Gagal memuat data"}
          </p>
        ) : (
          <Table removeWrapper aria-label="Jumlah data per tabel">
            <TableHeader>
              <TableColumn>NAMA TABEL</TableColumn>
              <TableColumn align="end">JUMLAH DATA</TableColumn>
            </TableHeader>
            <TableBody items={data?.tableCounts || []}>
              {(item) => (
                <TableRow key={item.tableName}>
                  <TableCell className="capitalize">{item.tableName}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatNumber(item.rowCount)}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardBody>
      <CardFooter>
        <p className="text-sm font-semibold text-default-600">
          Ukuran Database:{" "}
          <span className="text-primary font-bold">
            {data?.dbSizeMB.toFixed(2) || "0.00"} MB
          </span>
        </p>
      </CardFooter>
    </Card>
  );
};
