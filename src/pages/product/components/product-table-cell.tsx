// Berkas: sultanfarrel/otomax-web-report/otomax-web-report-new-api/src/pages/product/components/product-table-cell.tsx

import React from "react";
import { Product } from "@/types";
import { formatCurrency } from "@/utils/formatters";
import { STATUS_COLORS } from "../constants/product-constants";
import { Chip } from "@heroui/chip";

// Logika status disederhanakan
const getProductStatus = (product: Product): string => {
  if (product.gangguan) return "Gangguan";
  if (product.kosong) return "Kosong";
  // Asumsi default adalah "Aktif" jika tidak ada gangguan atau kosong
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
          {/* Hapus `kode_operator` karena sudah tidak ada */}
          <p className="font-bold text-sm">{cellValue as string}</p>
        </div>
      );
    case "harga_jual":
      // Gunakan `harga_jual` langsung
      return <p className="text-sm"> {formatCurrency(cellValue as number)}</p>;
    // Hapus case untuk `harga_beli`

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
