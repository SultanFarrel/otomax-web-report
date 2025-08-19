import React from "react";

import { Product } from "@/types";
import { Provider } from "@/hooks/useProducts"; // <-- Impor tipe Provider
import { formatCurrency } from "@/utils/formatters";

import { STATUS_COLORS } from "../constants/product-constants";

import { Chip } from "@heroui/chip";

// --- FUNGSI DIPERBARUI untuk menerima data provider ---
const getProductStatus = (product: Product, providers?: Provider[]): string => {
  // Cari provider yang sesuai dengan produk
  const provider = providers?.find((p) => p.kode === product.kode_operator);

  // Prioritas 1: Cek status provider terlebih dahulu
  if (provider) {
    if (provider.gangguan === 1) return "Gangguan";
    if (provider.kosong === 1) return "Kosong";
  }

  // Prioritas 2: Jika provider aman, cek status produk itu sendiri
  if (product.gangguan) return "Gangguan";
  if (product.kosong) return "Kosong";
  if (product.aktif) return "Aktif";

  // Default
  return "Tidak Aktif";
};

// --- INTERFACE DIPERBARUI untuk menerima prop providers ---
interface ProductTableCellProps {
  product: Product;
  columnKey: React.Key;
  providers?: Provider[]; // Prop baru, bersifat opsional
}

export const ProductTableCell: React.FC<ProductTableCellProps> = ({
  product,
  columnKey,
  providers, // Terima prop baru
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
      // --- PANGGIL FUNGSI YANG DIPERBARUI ---
      const statusText = getProductStatus(product, providers);
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
