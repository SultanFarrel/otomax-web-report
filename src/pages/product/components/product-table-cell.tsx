import React from "react";
import { Product } from "@/types";
import { formatCurrency } from "@/utils/formatters";
import { STATUS_COLORS } from "../constants/product-constants";
import { Chip } from "@heroui/chip";

const getProductStatus = (product: Product): string => {
  if (product.gangguan) return "Gangguan";
  if (product.kosong) return "Kosong";

  return "Aktif";
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
          <p className="font-bold text-sm">{cellValue as string}</p>
        </div>
      );
    case "harga_jual":
      return <p className="text-sm"> {formatCurrency(cellValue as number)}</p>;

    case "status": {
      const statusText = getProductStatus(product);
      return (
        <Chip
          color={STATUS_COLORS[statusText]}
          size="sm"
          variant="flat"
          classNames={{ base: "min-w-20 justify-center" }}
        >
          {statusText}
        </Chip>
      );
    }
    default:
      return <p className="text-sm"> {cellValue as string}</p>;
  }
};
