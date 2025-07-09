import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Product = {
  kode: string;
  nama: string;
  harga_jual: number;
  harga_beli: number;
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
