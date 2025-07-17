import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Product = {
  kode: string;
  nama: string;
  harga_jual: number;
  harga_beli: number;
  harga_jual_final: number;
  aktif: number;
  kosong: number;
  gangguan: number;
  kode_operator: string;
  RowNum: string;
};

export type Transaction = {
  kode: number;
  tgl_entri: string;
  kode_produk: string;
  tujuan: string;
  kode_reseller: string;
  pengirim: string;
  tipe_pengirim: string;
  harga: number;
  status: number;
  harga_beli: number;
  saldo_awal: number;
  sn: string | null;
  qty: number;
  komisi: number | null;
  poin: number | null;
  saldo_supplier: number | null;
  RowNum: string;
  tgl_status: string;
  laba: number;
  saldo_akhir: number;
};

export interface Downline {
  kode: string;
  nama: string;
  saldo: number;
  alamat: string;
  aktif: number;
  suspend: number;
  kode_upline: string;
  kode_level: string;
  keterangan: string | null;
  tgl_daftar: string;
  saldo_minimal: number;
  tgl_aktivitas: string | null;
  pengingat_saldo: number;
  RowNum: string;
  total_downline: number;

  // Properti opsional untuk struktur pohon
  level?: number;
  children?: Downline[];
  hasChildren?: boolean; // Untuk menandakan apakah perlu menampilkan tombol expand
}

export type BalanceMutation = {
  kode: number;
  tanggal: string;
  jumlah: number;
  keterangan: string;
  saldo_akhir: number;
};

export type ApiResponse = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  data: Product[];
};

export type TransactionApiResponse = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  data: Transaction[];
};

export interface DownlineApiResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  data: Downline[];
}

export type BalanceMutationApiResponse = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  data: BalanceMutation[];
};
