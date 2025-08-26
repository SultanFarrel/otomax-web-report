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
  ref_id: string; // TAMBAHKAN properti ini
  tgl_entri: string;
  kode_produk: string;
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

export type ProductApiResponse = {
  rowCount: number;
  data: Product[];
};

export type TransactionApiResponse = {
  rowCount: number; // GANTI dari totalItems menjadi rowCount
  data: Transaction[];
};

export interface DownlineApiResponse {
  rowCount: number; // Ganti dari totalItems/properti lain menjadi rowCount
  data: Downline[];
}

export type BalanceMutationApiResponse = {
  moreDataOffset: number; // TAMBAHKAN properti ini
  rowCount: number; // GANTI dari totalItems/totalPages/currentPage
  data: BalanceMutation[];
};

// Tipe data untuk ringkasan statistik
interface DashboardStats {
  total_sukses_today: number;
  total_proses: number;
  total_gagal_today: number;
  harga_sukses_today: number;
  harga_proses: number;
  harga_gagal_today: number;
}

// Tipe data untuk tren transaksi
interface TransactionTrend {
  tanggal: string;
  jumlah: number;
}

// Tipe data untuk top produk
interface TopProduct {
  kode_produk: string;
  jumlah: number;
}

// Tipe data untuk top reseller
interface TopReseller {
  kode_reseller: string;
  nama_reseller: string;
  jumlah_transaksi: number;
}

// Tipe data untuk respons gabungan dari API
export interface DashboardData {
  stats: DashboardStats;
  transactionsByStatus: { status: string; jumlah: number }[];
  transactionsByProduct: { kode: string; value: number }[];
  transactionTrend: TransactionTrend[]; // Data baru untuk tren
  recentTransactions: Transaction[];
  recentMutasi: BalanceMutation[];
  topProducts: TopProduct[];
  topResellers: TopReseller[];
}
