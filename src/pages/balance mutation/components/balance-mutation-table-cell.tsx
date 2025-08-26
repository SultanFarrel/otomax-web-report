import React from "react";
import { BalanceMutation } from "@/types";
import { formatCurrency, formatDate } from "@/utils/formatters";
import cn from "clsx";

interface BalanceMutationTableCellProps {
  mutation: BalanceMutation;
  columnKey: React.Key;
}

const BalanceMutationTableCell: React.FC<BalanceMutationTableCellProps> = ({
  mutation,
  columnKey,
}) => {
  const cellValue = mutation[columnKey as keyof BalanceMutation];

  switch (columnKey) {
    case "tanggal":
      return (
        <p className="text-sm">
          {formatDate(cellValue as string, {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
        </p>
      );
    case "jumlah":
      const isDebit = (cellValue as number) > 0;
      return (
        <p
          className={cn("text-sm font-semibold text-right", {
            "text-success": isDebit,
            "text-danger": !isDebit,
          })}
        >
          {formatCurrency(cellValue as number)}
        </p>
      );
    case "saldo_akhir":
      return <p className="text-sm">{formatCurrency(cellValue as number)}</p>;
    case "keterangan":
      return <p className="text-sm">{cellValue}</p>;
    default:
      return <>{cellValue}</>;
  }
};

export const BalanceMutationTableCellComponent = React.memo(
  BalanceMutationTableCell
);
