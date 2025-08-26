import React from "react";
import { Downline } from "@/types";
import { formatCurrency, formatDateTimeCustom } from "@/utils/formatters";
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
}

export const DownlineTableCell: React.FC<DownlineTableCellProps> = ({
  downline,
  columnKey,
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
      return <p className="text-sm">{formatCurrency(cellValue as number)}</p>;

    case "tgl_daftar":
    case "tgl_aktivitas":
      return (
        <p className="text-sm">{formatDateTimeCustom(cellValue as string)}</p>
      );

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
