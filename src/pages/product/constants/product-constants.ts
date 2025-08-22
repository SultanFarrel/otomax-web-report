import { ChipProps } from "@heroui/chip";

const COLUMN_NAMES = [
  { name: "KODE", uid: "kode" },
  { name: "NAMA", uid: "nama" },
  { name: "HARGA BELI", uid: "harga_beli" },
  { name: "HARGA JUAL", uid: "harga_jual" },
  { name: "STATUS", uid: "status" },
];

const STATUS_OPTIONS = [
  { name: "Semua", uid: "all" },
  { name: "Aktif", uid: "aktif" },
  { name: "Tidak Aktif", uid: "nonaktif" },
  { name: "Kosong", uid: "kosong" },
  { name: "Gangguan", uid: "gangguan" },
];

const STATUS_COLORS: Record<string, ChipProps["color"]> = {
  Aktif: "success",
  "Tidak Aktif": "default",
  Kosong: "warning",
  Gangguan: "danger",
};

export { COLUMN_NAMES, STATUS_OPTIONS, STATUS_COLORS };
