import React from "react";
import { Transaction } from "@/types";
import { formatCurrency, formatDateTimeCustom } from "@/utils/formatters";
import { STATUS_COLORS } from "../constants/downline-transactions-contants";
import { Tooltip } from "@heroui/tooltip";
import { Chip } from "@heroui/chip";
import { EyeIcon } from "@heroicons/react/24/outline";

interface DownlineTransactionTableCellProps {
  trx: Transaction;
  columnKey: React.Key;
  onViewDetails: (trx: Transaction) => void;
}

const DownlineTransactionTableCell: React.FC<
  DownlineTransactionTableCellProps
> = ({ trx, columnKey, onViewDetails }) => {
  const cellValue = trx[columnKey as keyof Transaction];

  switch (columnKey) {
    case "kode":
    case "ref_id":
      return <p className="text-sm font-mono">{cellValue}</p>;
    case "tgl_entri":
    case "tgl_status":
      return (
        <p className="text-sm">{formatDateTimeCustom(cellValue as string)}</p>
      );
    case "harga":
      return <p className="text-sm">{formatCurrency(cellValue as number)}</p>;
    case "status":
      const statusInfo = STATUS_COLORS[trx.status] || {
        color: "default",
        text: "Unknown",
      };
      return (
        <Chip
          color={statusInfo.color}
          size="sm"
          variant="flat"
          classNames={{
            base: "min-w-32 justify-center",
          }}
        >
          {statusInfo.text}
        </Chip>
      );
    case "sn":
      return (
        <p
          className="text-xs font-mono max-w-xs truncate"
          title={cellValue as string}
        >
          {cellValue || "N/A"}
        </p>
      );
    case "actions":
      return (
        <div className="relative flex justify-end items-center gap-2">
          <Tooltip content="Lihat Detail" closeDelay={0}>
            <button
              onClick={() => onViewDetails(trx)}
              className="text-lg text-default-400 cursor-pointer active:opacity-50"
            >
              <EyeIcon className="h-5 w-5" />
            </button>
          </Tooltip>
        </div>
      );
    default:
      return <p className="text-sm">{cellValue}</p>;
  }
};

export const DownlineTransactionTableCellComponent = React.memo(
  DownlineTransactionTableCell
);
