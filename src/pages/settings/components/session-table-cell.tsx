import React from "react";
import { Session } from "@/types";
import { formatDate } from "@/utils/formatters";
import { Tooltip } from "@heroui/tooltip";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { TrashIcon } from "@heroicons/react/24/outline";

interface SessionTableCellProps {
  session: Session;
  columnKey: React.Key;
  onKillSession: (kode: number) => void;
  isKilling: boolean;
}

// Fungsi helper untuk format IP
const formatIp = (ip: string) => {
  return ip && ip.startsWith("::ffff:") ? ip.substring(7) : ip;
};

export const SessionTableCell: React.FC<SessionTableCellProps> = ({
  session,
  columnKey,
  onKillSession,
  isKilling,
}) => {
  const cellValue = session[columnKey as keyof Session];

  switch (columnKey) {
    case "tgl_login":
      return <>{formatDate(cellValue as string)}</>;

    case "ip":
      return <>{formatIp(cellValue as string)}</>;

    case "kode_reseller":
      return <>{cellValue}</>;

    case "user_agent":
      return (
        <Tooltip content={session.user_agent || "Tidak ada data"}>
          <p className="max-w-[200px] truncate text-sm">
            {session.user_agent || "-"}
          </p>
        </Tooltip>
      );

    case "status":
      return session.is_current === 1 ? (
        <Chip color="success" size="sm" variant="flat">
          Sesi Saat Ini
        </Chip>
      ) : null;

    case "actions":
      return (
        <div className="flex justify-end">
          <Tooltip content="Hentikan Sesi" color="danger">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="danger"
              onPress={() => onKillSession(session.kode)}
              isDisabled={session.is_current === 1 || isKilling}
            >
              <TrashIcon className="h-5 w-5" />
            </Button>
          </Tooltip>
        </div>
      );

    default:
      return <>{cellValue as string}</>;
  }
};
