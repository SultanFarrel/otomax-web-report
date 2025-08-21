// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";

// Replikasi logika baseURL dari src/api/axios.ts
const API_PROTOCOL = "http";
const API_PORT = "4001";
const currentHostname =
  typeof window !== "undefined" ? window.location.hostname : "localhost";
const baseURL = `${API_PROTOCOL}://${currentHostname}:${API_PORT}/api`;

const randomDate = (
  start = new Date(new Date().setMonth(new Date().getMonth() - 3)),
  end = new Date()
) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).toISOString();
};

// --- DATA MOCK BARU DENGAN STRUKTUR SPESIFIK ---

// Fungsi bantuan untuk membuat objek downline
const createDownline = (details: {
  kode: string;
  nama: string;
  uplineKode: string;
  total_downline: number;
  level: string;
}) => {
  const status = Math.floor(Math.random() * 3); // 0: aktif, 1: nonaktif, 2: suspend
  return {
    ...details,
    saldo: Math.floor(Math.random() * 500000),
    komisi: Math.floor(Math.random() * 5000),
    poin: Math.floor(Math.random() * 100),
    aktif: status === 0 ? 1 : 0,
    suspend: status === 2 ? 1 : 0,
    markup: `${Math.floor(Math.random() * 10) * 25}`,
    tgl_daftar: randomDate(),
    tgl_aktivitas: randomDate(),
    RowNum: details.kode,
  };
};

// Definisikan semua downline sesuai struktur
const downlineH = createDownline({
  kode: "DL-H",
  nama: "Downline H",
  uplineKode: "DL-D",
  total_downline: 0,
  level: "RETAIL",
});
const downlineG = createDownline({
  kode: "DL-G",
  nama: "Downline G",
  uplineKode: "DL-B",
  total_downline: 0,
  level: "RESELLER",
});
const downlineF = createDownline({
  kode: "DL-F",
  nama: "Downline F",
  uplineKode: "DL-B",
  total_downline: 0,
  level: "RESELLER",
});
const downlineE = createDownline({
  kode: "DL-E",
  nama: "Downline E",
  uplineKode: "DL-A",
  total_downline: 0,
  level: "RESELLER",
});
const downlineD = createDownline({
  kode: "DL-D",
  nama: "Downline D",
  uplineKode: "DL-A",
  total_downline: 1,
  level: "RESELLER",
});
const downlineC = createDownline({
  kode: "DL-C",
  nama: "Downline C",
  uplineKode: "RES001",
  total_downline: 0,
  level: "AGEN",
});
const downlineB = createDownline({
  kode: "DL-B",
  nama: "Downline B",
  uplineKode: "RES001",
  total_downline: 2,
  level: "AGEN",
});
const downlineA = createDownline({
  kode: "DL-A",
  nama: "Downline A",
  uplineKode: "RES001",
  total_downline: 2,
  level: "AGEN",
});

// Susun hierarki dalam satu objek
const allDownlines = {
  RES001: [downlineA, downlineB, downlineC],
  "DL-A": [downlineD, downlineE],
  "DL-B": [downlineF, downlineG],
  "DL-D": [downlineH],
  // Downline C, E, F, G, H tidak memiliki sub-downline, jadi tidak perlu ada entry untuk mereka
};

// --- DATA MOCK BARU UNTUK TRANSAKSI ---
const productCodes = ["PULSA10", "PLN20K", "DATA5GB", "GAME100", "GOPAY50K"];
const statuses = [1, 20, 40, 50, 2]; // Proses, Sukses, Gagal, Dibatalkan, Menunggu Jawaban

const mockTransactions = Array.from({ length: 200 }, (_, i) => {
  const harga = Math.floor(Math.random() * 100000) + 5000;
  const harga_beli = harga - Math.floor(Math.random() * 1000) + 250;
  const saldo_awal = Math.floor(Math.random() * 1000000) + 200000;
  return {
    kode: 1000 + i,
    refid: 1000 + i,
    tgl_entri: randomDate(),
    kode_produk: productCodes[i % productCodes.length],
    tujuan: `081${String(Math.floor(Math.random() * 900000000) + 100000000)}`,
    kode_reseller: "RES001",
    pengirim: "WHATSAPP",
    harga: harga,
    status: statuses[i % statuses.length],
    harga_beli: harga_beli,
    saldo_awal: saldo_awal,
    sn: `SN${Date.now()}${i}`,
    laba: harga - harga_beli,
    saldo_akhir: saldo_awal - harga_beli,
    tgl_status: randomDate(),
  };
});

// ------------------------------------

// --- DATA MOCK BARU UNTUK TRANSAKSI DOWNLINE---
const downlineResellers = ["DL-A", "DL-B", "DL-C", "DL-D"];
const mockDownlineTransactions = Array.from({ length: 150 }, (_, i) => {
  const harga = Math.floor(Math.random() * 50000) + 5000;
  const harga_beli = harga - Math.floor(Math.random() * 800) + 200;
  const saldo_awal = Math.floor(Math.random() * 700000) + 100000;
  return {
    kode: 2000 + i,
    refid: 2000 + i,
    tgl_entri: randomDate(),
    kode_produk: productCodes[i % productCodes.length],
    tujuan: `085${String(Math.floor(Math.random() * 900000000) + 100000000)}`,
    kode_reseller: downlineResellers[i % downlineResellers.length],
    pengirim: "SMS",
    harga: harga,
    status: statuses[i % statuses.length],
    harga_beli: harga_beli,
    saldo_awal: saldo_awal,
    sn: `DSN${Date.now()}${i}`,
    laba: harga - harga_beli,
    saldo_akhir: saldo_awal - harga_beli,
    komisi: Math.floor(Math.random() * 200) + 25,
    tgl_status: randomDate(),
  };
});

export const handlers = [
  // Handles a POST /auth/login request
  http.post(`${baseURL}/auth/login`, () => {
    return HttpResponse.json({
      token: "mocked_user_token",
    });
  }),

  // Handles a GET /reseller/me request
  http.get(`${baseURL}/reseller/me`, () => {
    return HttpResponse.json({
      kode: "RES001",
      nama: "Reseller Mock",
      saldo: 1000000,
      komisi: 15000,
      poin: 753,
    });
  }),

  // Handles a GET /dashboard/summary/:kodeUpline request
  http.get(`${baseURL}/dashboard/summary/:kodeUpline`, () => {
    return HttpResponse.json({
      stats: {
        total_sukses_today: 1200,
        total_proses: 1200,
        total_gagal_today: 1200,
        harga_sukses_today: 18277,
        harga_proses: 18277,
        harga_gagal_today: 18277,
      },
    });
  }),

  // Handles a GET /dashboard/recent-transaction-mutation/:kodeUpline request
  http.get(
    `${baseURL}/dashboard/recent-transaction-mutation/:kodeUpline`,
    () => {
      return HttpResponse.json({
        recentTransactions: [
          {
            kode: 1,
            tgl_entri: new Date().toISOString(),
            kode_produk: "PULSA10",
            tujuan: "081234567890",
            harga: 10500,
            status: 20,
            RowNum: "1",
          },
          {
            kode: 2,
            tgl_entri: new Date().toISOString(),
            kode_produk: "PLN20",
            tujuan: "123456789",
            harga: 20000,
            status: 40,
            RowNum: "2",
          },
          {
            kode: 3,
            tgl_entri: new Date().toISOString(),
            kode_produk: "PLN500",
            tujuan: "123456789",
            harga: 500000,
            status: 1,
            RowNum: "3",
          },
        ],
        recentMutasi: [
          {
            kode: 1,
            tanggal: new Date().toISOString(),
            keterangan: "Deposit Saldo",
            jumlah: 500000,
            saldo_akhir: 1500000,
          },
          {
            kode: 2,
            tanggal: new Date().toISOString(),
            keterangan: "Pembelian PULSA10",
            jumlah: -10500,
            saldo_akhir: 1489500,
          },
        ],
      });
    }
  ),

  // Handles a GET /dashboard/status-chart/:kodeUpline request
  http.get(`${baseURL}/dashboard/status-chart/:kodeUpline`, () => {
    return HttpResponse.json([
      { status: "Sukses", jumlah: 1200 },
      { status: "Proses", jumlah: 500 },
      { status: "Gagal", jumlah: 1200 },
    ]);
  }),

  // Handles a GET /reseller/upline/:uplineKode request
  http.get(`${baseURL}/reseller/upline/:uplineKode`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10");
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "all";

    // Untuk tabel, kita hanya tampilkan downline level 1
    let filteredData = allDownlines["RES001"];

    if (search) {
      filteredData = filteredData.filter(
        (dl) =>
          dl.nama.toLowerCase().includes(search.toLowerCase()) ||
          dl.kode.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== "all") {
      filteredData = filteredData.filter((dl) => {
        if (status === "aktif") return dl.aktif === 1 && dl.suspend === 0;
        if (status === "nonaktif") return dl.aktif === 0 && dl.suspend === 0;
        if (status === "suspend") return dl.suspend === 1;
        return false;
      });
    }

    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const data = filteredData.slice((page - 1) * pageSize, page * pageSize);

    return HttpResponse.json({
      totalItems,
      totalPages,
      currentPage: page,
      data,
    });
  }),

  // --- HANDLER BARU UNTUK TRANSAKSI ---
  http.get(`${baseURL}/transaksi/reseller/:kode`, ({ request }) => {
    const url = new URL(request.url);

    // Ambil semua parameter filter
    const trxId = url.searchParams.get("trxId");
    const refId = url.searchParams.get("refId");
    const kodeProduk = url.searchParams.get("kodeProduk");
    const tujuan = url.searchParams.get("tujuan");
    const sn = url.searchParams.get("sn");
    const status = url.searchParams.get("status");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    let filteredData = mockTransactions;

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0); // Set ke awal hari

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Set ke akhir hari

      filteredData = filteredData.filter((trx) => {
        const trxDate = new Date(trx.tgl_entri);
        return trxDate >= start && trxDate <= end;
      });
    }

    if (trxId) {
      filteredData = filteredData.filter((trx) =>
        String(trx.kode).includes(trxId)
      );
    }
    if (refId) {
      filteredData = filteredData.filter((trx) =>
        String(trx.kode).includes(refId)
      );
    }
    if (kodeProduk) {
      filteredData = filteredData.filter((trx) =>
        trx.kode_produk.toLowerCase().includes(kodeProduk.toLowerCase())
      );
    }
    if (tujuan) {
      filteredData = filteredData.filter((trx) => trx.tujuan.includes(tujuan));
    }
    if (sn) {
      filteredData = filteredData.filter(
        (trx) => trx.sn && trx.sn.toLowerCase().includes(sn.toLowerCase())
      );
    }
    if (status) {
      filteredData = filteredData.filter(
        (trx) => trx.status === parseInt(status)
      );
    }

    return HttpResponse.json({
      data: filteredData,
    });
  }),

  // --- HANDLER BARU UNTUK TRANSAKSI DOWNLINE ---
  http.get(`${baseURL}/transaksi/upline/:kode`, ({ request }) => {
    const url = new URL(request.url);

    const trxId = url.searchParams.get("trxId");
    const refId = url.searchParams.get("refId");
    const kodeProduk = url.searchParams.get("kodeProduk");
    const tujuan = url.searchParams.get("tujuan");
    const sn = url.searchParams.get("sn");
    const kodeReseller = url.searchParams.get("kodeReseller");
    const status = url.searchParams.get("status");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    let filteredData = mockDownlineTransactions;

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      filteredData = filteredData.filter((trx) => {
        const trxDate = new Date(trx.tgl_entri);
        return trxDate >= start && trxDate <= end;
      });
    }

    if (trxId) {
      filteredData = filteredData.filter((trx) =>
        String(trx.kode).includes(trxId)
      );
    }
    if (refId) {
      filteredData = filteredData.filter((trx) =>
        String(trx.kode).includes(refId)
      );
    }
    if (kodeProduk) {
      filteredData = filteredData.filter((trx) =>
        trx.kode_produk.toLowerCase().includes(kodeProduk.toLowerCase())
      );
    }
    if (tujuan) {
      filteredData = filteredData.filter((trx) => trx.tujuan.includes(tujuan));
    }
    if (sn) {
      filteredData = filteredData.filter(
        (trx) => trx.sn && trx.sn.toLowerCase().includes(sn.toLowerCase())
      );
    }
    if (kodeReseller) {
      filteredData = filteredData.filter((trx) =>
        trx.kode_reseller.toLowerCase().includes(kodeReseller.toLowerCase())
      );
    }
    if (status) {
      filteredData = filteredData.filter(
        (trx) => trx.status === parseInt(status)
      );
    }

    return HttpResponse.json({
      data: filteredData,
    });
  }),
];
