import React from "react";

import { Product } from "@/types";
import { formatCurrency } from "@/utils/formatters";

import { STATUS_COLORS } from "../constants/product-constants";

import { Chip } from "@heroui/chip";

const getProductStatus = (product: Product): string => {
  if (product.gangguan) return "Gangguan";
  if (product.kosong) return "Kosong";
  if (product.aktif) return "Aktif";
  return "Tidak Aktif";
};

interface ProductTableCellProps {
  product: Product;
  columnKey: React.Key;
}

export const ProductTableCell: React.FC<ProductTableCellProps> = ({
  product,
  columnKey,
}) => {
  const cellValue = product[columnKey as keyof Product];

  switch (columnKey) {
    case "nama":
      return (
        <div>
          <p className="font-bold text-sm">{cellValue}</p>
          <p className="text-xs text-default-500">{product.kode_operator}</p>
        </div>
      );
    case "harga_jual":
      return (
        <p className="text-sm"> {formatCurrency(product.harga_jual_final)}</p>
      );
    case "harga_beli":
      return <p className="text-sm"> {formatCurrency(cellValue as number)}</p>;

    case "status": {
      const statusText = getProductStatus(product);
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
      return <p className="text-sm"> {cellValue}</p>;
  }
};
