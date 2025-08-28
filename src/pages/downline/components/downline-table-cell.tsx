import React from "react";
import { Downline } from "@/types";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { STATUS_COLORS } from "../constants/downline-constants";
import { Chip } from "@heroui/chip";

const getDownlineStatus = (downline: Downline): string => {
  if (downline.suspend) return "Suspend";
  if (downline.aktif) return "Aktif";
  return "Nonaktif";
};

interface DownlineTableCellProps {
  downline: Downline;
  columnKey: React.Key;
  hasKomisi: boolean;
}

export const DownlineTableCell: React.FC<DownlineTableCellProps> = ({
  downline,
  columnKey,
  hasKomisi,
}) => {
  const cellValue = downline[columnKey as keyof Downline];

  switch (columnKey) {
    case "nama":
      return (
        <div>
          <p className="font-bold text-sm">{cellValue as string}</p>
        </div>
      );

    case "saldo":
    case "komisi":
      const commissionValue = hasKomisi ? (cellValue as number) : 0;
      return <p className="text-sm">{formatCurrency(commissionValue)}</p>;

    case "poin":
      return <p className="text-sm">{cellValue || 0}</p>;

    case "tgl_daftar":
    case "tgl_aktivitas":
      return <p className="text-sm">{formatDate(cellValue as string)}</p>;

    case "status": {
      const statusText = getDownlineStatus(downline);
      return (
        <Chip
          className="capitalize"
          color={STATUS_COLORS[statusText]}
          size="sm"
          variant="flat"
          classNames={{ base: "min-w-16 justify-center" }}
        >
          {statusText}
        </Chip>
      );
    }

    default:
      return <p className="text-sm">{String(cellValue)}</p>;
  }
};
