import { ChipProps } from "@heroui/chip";

export const COLUMN_NAMES = [
  { name: "KODE", uid: "kode" },
  { name: "NAMA", uid: "nama" },
  { name: "SALDO", uid: "saldo" },
  { name: "KOMISI", uid: "komisi" },
  { name: "POIN", uid: "poin" },
  { name: "STATUS", uid: "status" },
  { name: "KODE UPLINE", uid: "kode_upline" },
  { name: "MARKUP", uid: "markup" },
  { name: "TGL DAFTAR", uid: "tgl_daftar" },
  { name: "AKTIVITAS TERAKHIR", uid: "tgl_aktivitas" },
];

export const STATUS_OPTIONS = [
  { name: "Semua", uid: "all" },
  { name: "Aktif", uid: "aktif" },
  { name: "Nonaktif", uid: "nonaktif" },
  { name: "Suspend", uid: "suspend" },
];

export const STATUS_COLORS: Record<string, ChipProps["color"]> = {
  Aktif: "success",
  Nonaktif: "default",
  Suspend: "danger",
};
