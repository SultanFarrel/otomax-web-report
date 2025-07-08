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
  kode_operator: string;
  RowNum: string;
};

export type ApiResponse = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  data: Product[];
};
