import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { Tooltip } from "@heroui/tooltip";
import { TrashIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { useSessions } from "@/hooks/useSessions";
import { formatDate } from "@/utils/formatters";
import { Session } from "@/types";

export const SessionList: React.FC = () => {
  const {
    sessions,
    isLoading,
    isError,
    killSession,
    isKilling,
    refetchSessions,
    isRefetching,
  } = useSessions();

  const handleKillSession = (kode: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghentikan sesi ini?")) {
      killSession(kode);
    }
  };

  const formatIp = (ip: string) => {
    if (ip && ip.startsWith("::ffff:")) {
      return ip.substring(7);
    }
    return ip;
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Sesi Aktif</h2>
          <p className="text-sm text-default-500 mb-4">
            Daftar sesi yang sedang aktif. Anda dapat menghentikan sesi lain
            jika diperlukan.
          </p>
        </div>
        <Tooltip content="Refresh Daftar Sesi">
          <Button
            isIconOnly
            variant="light"
            onPress={() => refetchSessions()}
            isLoading={isRefetching}
          >
            <ArrowPathIcon className="h-5 w-5" />
          </Button>
        </Tooltip>
      </div>
      <Table aria-label="Tabel Sesi Aktif">
        <TableHeader>
          <TableColumn>TANGGAL LOGIN</TableColumn>
          <TableColumn>ALAMAT IP</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn align="end">AKSI</TableColumn>
        </TableHeader>
        <TableBody
          items={sessions}
          isLoading={isLoading || isKilling}
          loadingContent={<Spinner label="Memuat data sesi..." />}
          emptyContent={isError ? "Gagal memuat data" : "Tidak ada sesi aktif"}
        >
          {(item: Session) => (
            <TableRow key={item.kode}>
              <TableCell>{formatDate(item.tgl_login)}</TableCell>
              <TableCell>{formatIp(item.ip)}</TableCell>
              <TableCell>
                {item.is_current === 1 && (
                  <Chip color="success" size="sm" variant="flat">
                    Sesi Saat Ini
                  </Chip>
                )}
              </TableCell>
              <TableCell className="flex justify-end">
                <Tooltip content="Hentikan Sesi" color="danger">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => handleKillSession(item.kode)}
                    isDisabled={item.is_current === 1 || isKilling}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </Button>
                </Tooltip>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
