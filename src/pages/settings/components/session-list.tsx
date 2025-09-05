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
import {
  TrashIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useSessions } from "@/hooks/useSessions";
import { formatDate } from "@/utils/formatters";
import { Session } from "@/types";
import { Input } from "@heroui/input";

interface SessionListProps {
  isAdminView?: boolean;
  sessionType?: "user" | "admin";
}

const USER_SESSION_COLUMNS = [
  { name: "TANGGAL LOGIN", uid: "tgl_login" },
  { name: "ALAMAT IP", uid: "ip" },
  { name: "STATUS", uid: "status" },
  { name: "AKSI", uid: "actions" },
];

const ADMIN_AGENT_SESSION_COLUMNS = [
  { name: "TANGGAL LOGIN", uid: "tgl_login" },
  { name: "KODE AGEN", uid: "kode_reseller" },
  { name: "ALAMAT IP", uid: "ip" },
  { name: "STATUS", uid: "status" },
  { name: "AKSI", uid: "actions" },
];

export const SessionList: React.FC<SessionListProps> = ({
  isAdminView = false,
  sessionType = "user",
}) => {
  const {
    sessions,
    isLoading,
    isError,
    killSession,
    isKilling,
    refetchSessions,
    isRefetching,
    search,
    setSearch,
    onSearchSubmit,
  } = useSessions({ sessionType });

  const isAgentListView = isAdminView && sessionType === "user";
  const columns = isAgentListView
    ? ADMIN_AGENT_SESSION_COLUMNS
    : USER_SESSION_COLUMNS;

  const title = isAdminView
    ? sessionType === "admin"
      ? "Sesi Admin Aktif"
      : "Sesi Agen Aktif"
    : "Sesi Aktif";

  const description = isAdminView
    ? `Daftar sesi ${sessionType === "admin" ? "admin" : "agen"} yang sedang aktif.`
    : "Daftar sesi yang sedang aktif. Anda dapat menghentikan sesi lain jika diperlukan.";

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
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-default-500 mb-4">{description}</p>
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

      {isAgentListView && (
        <div className="flex justify-end items-center gap-2 mb-4">
          <Input
            isClearable
            className="w-full sm:max-w-xs"
            placeholder="Cari kode agen..."
            startContent={<MagnifyingGlassIcon className="h-5 w-5" />}
            value={search}
            onClear={() => setSearch("")}
            onValueChange={setSearch}
          />
          <Button color="primary" onPress={onSearchSubmit}>
            Cari
          </Button>
        </div>
      )}

      <Table aria-label="Tabel Sesi Aktif">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "end" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={sessions}
          isLoading={isLoading || isKilling}
          loadingContent={<Spinner label="Memuat data sesi..." />}
          emptyContent={isError ? "Gagal memuat data" : "Tidak ada sesi aktif"}
        >
          {(item: Session) => (
            <TableRow key={item.kode}>
              {(columnKey) => (
                <TableCell>
                  {columnKey === "tgl_login" ? (
                    formatDate(item.tgl_login)
                  ) : columnKey === "ip" ? (
                    formatIp(item.ip)
                  ) : columnKey === "kode_reseller" ? (
                    item.kode_reseller
                  ) : columnKey === "status" && item.is_current === 1 ? (
                    <Chip color="success" size="sm" variant="flat">
                      Sesi Saat Ini
                    </Chip>
                  ) : columnKey === "actions" ? (
                    <div className="flex justify-end">
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
                    </div>
                  ) : null}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
