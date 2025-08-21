// src/pages/downline/components/downline-table-cell.tsx

import React from "react";
import { Downline } from "@/types";
// Impor fungsi baru dan hapus formatDate jika tidak digunakan di sini
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
          <p className="text-xs text-default-500">{downline.kode}</p>
        </div>
      );

    case "saldo":
    case "komisi":
      return <p className="text-sm">{formatCurrency(cellValue as number)}</p>;

    case "tgl_daftar":
    case "tgl_aktivitas":
      // Panggil fungsi baru langsung dari sini
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
        >
          {statusText}
        </Chip>
      );
    }

    default:
      return <p className="text-sm">{String(cellValue)}</p>;
  }
};
