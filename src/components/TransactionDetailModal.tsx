import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Chip, type ChipProps } from "@heroui/chip";
import { Transaction } from "@/types";

// Helper untuk status, pastikan ini konsisten dengan halaman transaksi
const statusColorMap: Record<
  string,
  { color: ChipProps["color"]; text: string }
> = {
  "1": { color: "warning", text: "Proses" },
  "20": { color: "success", text: "Sukses" },
  "201": { color: "danger", text: "Dialihkan" },
  "64": { color: "danger", text: "Diabaikan" },
  "52": { color: "danger", text: "Tujuan Salah" },
  "40": { color: "danger", text: "Gagal" },
  "2": { color: "primary", text: "Menunggu Jawaban" },
  "69": { color: "danger", text: "Cutoff" },
  "50": { color: "danger", text: "Dibatalkan" },
  "3": { color: "danger", text: "Gagal Kirim" },
  "59": { color: "danger", text: "Harga Tidak Sesuai" },
  "0": { color: "warning", text: "Kirim Ulang" },
  "54": { color: "danger", text: "Area Tidak Cocok" },
  "56": { color: "danger", text: "Blacklist" },
  "58": { color: "danger", text: "Tidak Aktif" },
  "47": { color: "danger", text: "Produk Gangguan" },
  "200": { color: "warning", text: "Proses Ulang" },
  "61": { color: "danger", text: "QTY Tidak Sesuai" },
  "45": { color: "danger", text: "Stok Kosong" },
  "55": { color: "danger", text: "Timeout" },
  "46": { color: "danger", text: "Transaksi Dobel" },
  "53": { color: "danger", text: "Luar Wilayah" },
  "4": { color: "warning", text: "Tidak ada Parsing" },
  "44": { color: "danger", text: "Produk Salah" },
};

// Komponen untuk menampilkan satu baris detail
const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex justify-between py-2 border-b border-default-100">
    <dt className="text-sm text-default-500">{label}</dt>
    <dd className="text-sm text-right font-semibold">{value || "-"}</dd>
  </div>
);

// Komponen utama Modal
interface ModalProps {
  trx: Transaction | null;
  onClose: () => void;
}

export const TransactionDetailModal: React.FC<ModalProps> = ({
  trx,
  onClose,
}) => {
  if (!trx) return null;

  const statusInfo = statusColorMap[trx.status] || {
    color: "default",
    text: `Status ${trx.status}`,
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "medium",
      timeZone: "UTC",
    }).format(new Date(dateString));

  return (
    <Modal isOpen={!!trx} onClose={onClose} size="2xl">
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Detail Transaksi
              <span className="text-sm font-normal text-default-500">
                TRX ID: {trx.kode}
              </span>
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {/* Kolom Kiri - Info Utama */}
                <div className="flex flex-col">
                  <h4 className="font-bold mb-2">Informasi Utama</h4>
                  <dl>
                    <DetailRow label="Produk" value={trx.kode_produk} />
                    <DetailRow label="Tujuan" value={trx.tujuan} />
                    <DetailRow
                      label="Status"
                      value={
                        <Chip color={statusInfo.color} size="sm" variant="flat">
                          {statusInfo.text}
                        </Chip>
                      }
                    />
                    <DetailRow
                      label="Tanggal Entri"
                      value={formatDate(trx.tgl_entri)}
                    />
                    <DetailRow
                      label="Tanggal Status"
                      value={trx.tgl_status ? formatDate(trx.tgl_status) : "-"}
                    />
                  </dl>
                </div>
                {/* Kolom Kanan - Info Finansial */}
                <div className="flex flex-col">
                  <h4 className="font-bold mb-2">Informasi Finansial</h4>
                  <dl>
                    <DetailRow
                      label="Harga Jual"
                      value={formatCurrency(trx.harga)}
                    />
                    <DetailRow
                      label="Harga Beli"
                      value={formatCurrency(trx.harga_beli)}
                    />
                    <DetailRow
                      label="Laba"
                      value={formatCurrency(trx.laba || 0)}
                    />
                    <DetailRow
                      label="Saldo Awal"
                      value={formatCurrency(trx.saldo_awal)}
                    />
                    <DetailRow
                      label="Saldo Akhir"
                      value={formatCurrency(
                        trx.saldo_akhir || trx.saldo_awal - trx.harga_beli
                      )}
                    />
                  </dl>
                </div>
              </div>
              {/* Bagian SN & Jawaban Provider */}
              <div className="mt-6">
                <h4 className="font-bold mb-2">Informasi Teknis</h4>
                <div className="flex flex-col gap-4">
                  {/* Pengirim */}
                  <div>
                    <p className="text-sm text-default-500 mb-1">Pengirim</p>
                    <p className="font-semibold">{trx.pengirim}</p>
                  </div>
                  {/* Kotak SN yang bisa di-scroll */}
                  <div>
                    <p className="text-sm text-default-500 mb-1">
                      SN / Jawaban Provider
                    </p>
                    <pre className="p-3 bg-default-100 rounded-lg text-xs font-mono max-h-32 overflow-y-auto whitespace-pre-wrap break-words">
                      {trx.sn || "-"}
                    </pre>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="light" onPress={close}>
                Tutup
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
