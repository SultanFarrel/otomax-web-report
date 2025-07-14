import { ChipProps } from "@heroui/chip";

// LIST TABLE COLUMNS
const COLUMN_NAMES = [
  { name: "TRX ID", uid: "kode", sortable: true },
  { name: "TGL ENTRI", uid: "tgl_entri", sortable: true },
  { name: "PRODUK", uid: "kode_produk" },
  { name: "TUJUAN", uid: "tujuan" },
  { name: "PENGIRIM", uid: "pengirim" },
  { name: "STATUS", uid: "status" },
  { name: "HARGA", uid: "harga", sortable: true },
  { name: "SN", uid: "sn" },
  { name: "ACTIONS", uid: "actions" },
];

// LIST STATUS COLOR
const STATUS_COLORS: Record<
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

// LIST STATUS
const STATUS_OPTIONS = [
  { name: "Semua", uid: "all" },
  { name: "Sukses", uid: "20" },
  { name: "Gagal", uid: "40" },
  { name: "Sedang Proses", uid: "1" },
  { name: "Menunggu Jawaban", uid: "2" },
  { name: "Gagal Kirim", uid: "3" },
  { name: "Dibatalkan", uid: "50" },
  { name: "Tujuan Salah", uid: "52" },
  { name: "Tujuan Diluar Wilayah", uid: "53" },
  { name: "Timeout", uid: "55" },
  { name: "Nomor Tidak Aktif", uid: "58" },
  { name: "Produk Salah", uid: "44" },
];

export { COLUMN_NAMES, STATUS_COLORS, STATUS_OPTIONS };
