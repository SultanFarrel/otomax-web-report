import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface SiteInfo {
  judul: string;
}

export type Product = {
  kode: string;
  nama: string;
  harga_jual: number;
  kosong: number;
  gangguan: number;
  // Jadikan properti lama opsional agar tidak menimbulkan error di tempat lain
  aktif?: number;
  harga_beli?: number;
  harga_jual_final?: number;
  kode_operator?: string;
  RowNum?: string;
};

export type Transaction = {
  kode: number;
  ref_id: string;
  tgl_entri: string;
  kode_produk: string;
  nama_operator: string;
  tujuan: string;
  harga: number;
  status: number;
  sn: string | null;
  saldo_awal: number;
  saldo_akhir: number;
  pengirim: string;
  tgl_status: string;
  // Jadikan properti lama opsional agar tidak menimbulkan error di komponen lain
  kode_reseller?: string;
  harga_beli?: number;
  laba?: number;
};

export interface Downline {
  kode: string;
  nama: string;
  saldo: number;
  alamat: string | null;
  aktif: number;
  kode_upline: string;
  kode_level: string;
  keterangan: string | null;
  tgl_daftar: string;
  saldo_minimal: number;
  tgl_aktivitas: string | null;
  pengingat_saldo: number;
  suspend: number | null;
  total_downline: number;

  // Properti baru untuk frontend
  komisi?: number;
  poin?: number;
  markup?: string;
}

export type DownlineTree = {
  kode: string;
  nama: string;
  downline: DownlineTree[];
};

export type BalanceMutation = {
  kode: number;
  tanggal: string;
  jumlah: number;
  keterangan: string;
  saldo_akhir: number;
};

export interface Session {
  kode: number;
  ip: string;
  tgl_login: string;
  is_current: 0 | 1;
}

export type ProductApiResponse = {
  rowCount: number;
  data: Product[];
};

export type TransactionApiResponse = {
  rowCount: number;
  data: Transaction[];
  moreDataOffset?: number;
};

export interface DownlineApiResponse {
  rowCount: number;
  data: Downline[];
  hasKomisi?: boolean;
}

export type BalanceMutationApiResponse = {
  moreDataOffset: number;
  rowCount: number;
  data: BalanceMutation[];
};

export interface SessionApiResponse {
  rowCount: number;
  data: Session[];
}

// Tipe data untuk ringkasan statistik
interface DashboardStats {
  total_sukses: number;
  total_pending: number;
  total_gagal: number;
  harga_sukses: number;
  harga_pending: number;
  harga_gagal: number;
}

// Tipe data untuk respons gabungan dari API
export interface DashboardData {
  stats: DashboardStats;
  recentTransactions: Transaction[];
  recentMutasi: BalanceMutation[];
}
