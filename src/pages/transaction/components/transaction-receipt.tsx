import React from "react";
import { Transaction } from "@/types";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { useUserStore } from "@/store/userStore";
import { Logo } from "@/components/icons";

interface Props {
  transaction: Transaction | null;
}

const DetailRow: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <div className="flex justify-between">
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

export const TransactionReceipt: React.FC<Props> = ({ transaction }) => {
  const user = useUserStore((state) => state.user);

  if (!transaction) {
    return null;
  }

  const { kode, tgl_entri, kode_produk, tujuan, harga, sn, status } =
    transaction;

  const isSuccess = status === 20;

  return (
    <div
      id="receipt-to-print"
      className="w-[58mm] p-2 bg-white text-black text-xs font-mono"
    >
      <div className="text-center mb-2">
        <Logo className="mx-auto" />
        <h2 className="font-bold text-sm">{user?.nama}</h2>
      </div>

      <hr className="border-t border-dashed border-black my-1" />

      <DetailRow label="Tanggal:" value={formatDate(tgl_entri)} />
      <DetailRow label="No. Transaksi:" value={kode} />

      <hr className="border-t border-dashed border-black my-1" />

      <DetailRow label="Produk:" value={kode_produk} />
      <DetailRow label="Tujuan:" value={tujuan} />
      <DetailRow label="Harga:" value={formatCurrency(harga)} />
      <DetailRow label="Status:" value={isSuccess ? "BERHASIL" : "GAGAL"} />

      {isSuccess && sn && (
        <>
          <hr className="border-t border-dashed border-black my-1" />
          <p className="font-bold">SN/Token:</p>
          <p className="break-words">{sn}</p>
        </>
      )}

      <hr className="border-t border-dashed border-black my-1" />

      <p className="text-center mt-2">Terima kasih atas transaksi Anda!</p>
    </div>
  );
};
