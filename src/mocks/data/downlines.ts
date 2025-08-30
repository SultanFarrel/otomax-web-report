const randomDate = (
  start = new Date(new Date().setMonth(new Date().getMonth() - 3)),
  end = new Date()
) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).toISOString();
};

const createDownline = (details: {
  kode: string;
  nama: string;
  kode_upline: string;
  total_downline: number;
  level: string;
}) => {
  const status = Math.floor(Math.random() * 3); // 0: aktif, 1: nonaktif, 2: suspend
  return {
    ...details,
    saldo: Math.floor(Math.random() * 500000),
    alamat: null,
    aktif: status === 0 ? 1 : 0,
    kode_level: details.level,
    keterangan: null,
    tgl_daftar: randomDate(),
    saldo_minimal: 0,
    tgl_aktivitas: randomDate(),
    pengingat_saldo: 20000,
    suspend: status === 2 ? 1 : null,
    komisi: Math.floor(Math.random() * 20000),
    poin: Math.floor(Math.random() * 500),
    markup: `${Math.floor(Math.random() * 5) * 25}`,
  };
};

export const allDownlines = [
  createDownline({
    kode: "AZ0002",
    nama: "INKA CELL",
    kode_upline: "RES001",
    total_downline: 0,
    level: "M",
  }),
  createDownline({
    kode: "AZ0003",
    nama: "KHAZNA CELL",
    kode_upline: "RES001",
    total_downline: 7,
    level: "M",
  }),
  ...Array.from({ length: 50 }, (_, i) =>
    createDownline({
      kode: `AZ${String(i + 4).padStart(4, "0")}`,
      nama: `AGEN CELL ${i + 1}`,
      kode_upline: i % 7 === 0 ? `AZ0003` : "RES001",
      total_downline: i % 5 === 0 ? 3 : 0,
      level: i % 2 === 0 ? "M" : "R",
    })
  ),
];
