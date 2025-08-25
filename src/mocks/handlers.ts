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

    // Mohon tambahkan properti 'komisi' di dalam respons.
    // Tipe data: number.
    // Contoh: 15000
    komisi: Math.floor(Math.random() * 20000),

    // Mohon tambahkan properti 'poin' di dalam respons.
    // Tipe data: number.
    // Contoh: 100
    poin: Math.floor(Math.random() * 500),

    // Mohon tambahkan properti 'markup' di dalam respons.
    // Tipe data: number.
    // Contoh: 25 atau 50
    markup: `${Math.floor(Math.random() * 5) * 25}`,
  };
};

const allDownlines = [
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
  // Menambahkan lebih banyak data
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

// --- DATA MOCK BARU UNTUK PRODUK ---
const operatorCodes = ["TSEL", "ISAT", "XL", "AXIS", "SMART"];
const productTypes = ["Pulsa", "Data", "Token PLN", "Voucher Game", "e-Money"];

const mockProducts = Array.from({ length: 150 }, (_, i) => {
  const harga_beli = Math.floor(Math.random() * 50000) + 5000;
  const harga_jual = harga_beli + Math.floor(Math.random() * 1000) + 250;
  const status = Math.floor(Math.random() * 4); // 0: Aktif, 1: Tidak Aktif, 2: Kosong, 3: Gangguan

  return {
    kode: `P${1000 + i}`,
    nama: `${productTypes[i % productTypes.length]} ${Math.floor(Math.random() * 100)}K`,
    harga_jual: harga_jual,
    harga_beli: harga_beli,
    harga_jual_final: harga_jual,
    aktif: status === 0 ? 1 : 0,
    kosong: status === 2 ? 1 : 0,
    gangguan: status === 3 ? 1 : 0,
    kode_operator: operatorCodes[i % operatorCodes.length],
    RowNum: String(i + 1),
  };
});

// --- DATA MOCK BARU UNTUK MUTASI SALDO ---
const mutationTypes = ["K", "T", "G", "O", "1", "2", "A", "Z", "B", " "];

const mockBalanceMutations = Array.from({ length: 500 }, (_, i) => {
  const type = mutationTypes[i % mutationTypes.length];
  let isDeposit = false;
  let keterangan = "";

  switch (type) {
    case "K":
      isDeposit = true;
      keterangan = "PENCARIAN KOMISI";
      break;
    case "T":
      keterangan = `TRX ${
        productCodes[i % productCodes.length]
      } KE 081234567${i.toString().padStart(3, "0")}`;
      break;
    case "G":
      isDeposit = true;
      keterangan = `REFUND TRX GAGAL ${1000 + i}`;
      break;
    case "O":
      keterangan = `REPLY/OUTBOX KE 081234567${i.toString().padStart(3, "0")}`;
      break;
    case "1":
      keterangan = `TRANSFER SALDO KE DL-${i}`;
      break;
    case "2":
      isDeposit = true;
      keterangan = `TRANSFER SALDO DARI UPLINE`;
      break;
    case "A":
      keterangan = "BIAYA ADMIN BULANAN";
      break;
    case "Z":
      keterangan = "MUTASI GABUNGAN HARIAN";
      break;
    case "B":
      isDeposit = true;
      keterangan = "DEPOSIT VIA TIKET BANK";
      break;
    case " ":
      keterangan = "PENAMBAHAN SALDO MANUAL";
      isDeposit = true;
      break;
  }

  const amount =
    Math.floor(Math.random() * (isDeposit ? 500000 : 50000)) + 1000;
  const saldo_akhir = 1000000 + (isDeposit ? amount : -amount) * (i + 1);
  return {
    kode: 3000 + i,
    tanggal: randomDate(),
    jumlah: isDeposit ? amount : -amount,
    keterangan: keterangan,
    saldo_akhir: saldo_akhir,
    type: type,
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

  // HANDLER BARU UNTUK /mutasi/recent
  http.get(`${baseURL}/mutasi/recent`, () => {
    return HttpResponse.json({
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
        {
          kode: 3,
          tanggal: new Date().toISOString(),
          keterangan: "Komisi",
          jumlah: 25000,
          saldo_akhir: 1514500,
        },
      ],
    });
  }),

  // HANDLER BARU UNTUK /transaksi/recent
  http.get(`${baseURL}/transaksi/recent`, () => {
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
    });
  }),

  // Handles a GET /reseller/upline/:uplineKode request
  http.get(`${baseURL}/reseller/upline/:uplineKode`, ({ request }) => {
    const url = new URL(request.url);
    const kode = url.searchParams.get("kode") || "";
    const nama = url.searchParams.get("nama") || "";
    const kode_upline = url.searchParams.get("kode_upline") || "";
    const status = url.searchParams.get("status") || "all";

    let filteredData = allDownlines;

    if (kode) {
      filteredData = filteredData.filter((dl) =>
        dl.kode.toLowerCase().includes(kode.toLowerCase())
      );
    }
    if (nama) {
      filteredData = filteredData.filter((dl) =>
        dl.nama.toLowerCase().includes(nama.toLowerCase())
      );
    }
    if (kode_upline) {
      filteredData = filteredData.filter((dl) =>
        dl.kode_upline.toLowerCase().includes(kode_upline.toLowerCase())
      );
    }

    if (status !== "all") {
      filteredData = filteredData.filter((dl) => {
        if (status === "aktif") return dl.aktif === 1 && !dl.suspend;
        if (status === "nonaktif") return dl.aktif === 0 && !dl.suspend;
        if (status === "suspend") return !!dl.suspend;
        return false;
      });
    }

    // Mengembalikan data dengan format { data: [...] }
    return HttpResponse.json({
      data: filteredData,
    });
  }),

  // --- HANDLER BARU UNTUK TRANSAKSI ---
  http.get(`${baseURL}/transaksi/reseller/:kode`, ({ request }) => {
    const url = new URL(request.url);

    const trxId = url.searchParams.get("trxId");
    const refId = url.searchParams.get("refId");
    const kodeProduk = url.searchParams.get("kodeProduk");
    const tujuan = url.searchParams.get("tujuan");
    const sn = url.searchParams.get("sn");
    const status = url.searchParams.get("status");
    const status_lt = url.searchParams.get("status_lt");
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
    if (status_lt) {
      // Logika filter untuk status < 20
      filteredData = filteredData.filter(
        (trx) => trx.status < parseInt(status_lt)
      );
    } else if (status) {
      // Logika filter lainnya
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
    const status_lt = url.searchParams.get("status_lt");
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
    if (status_lt) {
      // Logika filter untuk status < 20
      filteredData = filteredData.filter(
        (trx) => trx.status < parseInt(status_lt)
      );
    } else if (status) {
      // Logika filter lainnya
      filteredData = filteredData.filter(
        (trx) => trx.status === parseInt(status)
      );
    }

    return HttpResponse.json({
      data: filteredData,
    });
  }),

  // --- HANDLER BARU UNTUK PRODUK ---
  http.get(`${baseURL}/produk`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "all";

    let filteredData = mockProducts;

    if (search) {
      filteredData = filteredData.filter(
        (p) =>
          p.nama.toLowerCase().includes(search.toLowerCase()) ||
          p.kode.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== "all") {
      filteredData = filteredData.filter((p) => {
        if (status === "aktif")
          return p.aktif === 1 && p.gangguan === 0 && p.kosong === 0;
        if (status === "nonaktif") return p.aktif === 0;
        if (status === "kosong") return p.kosong === 1;
        if (status === "gangguan") return p.gangguan === 1;
        return false;
      });
    }

    // Tidak melakukan paginasi di sini, kirim semua data yang sudah difilter
    return HttpResponse.json({
      data: filteredData,
      totalItems: filteredData.length, // totalItems sekarang berdasarkan data yang difilter
    });
  }),

  // --- HANDLER BARU UNTUK MUTASI SALDO ---
  http.get(`${baseURL}/mutasi/reseller/:kode`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const mutationTypesParam = url.searchParams.get("mutationTypes");

    let filteredData = mockBalanceMutations;

    if (mutationTypesParam) {
      const types = mutationTypesParam.split(",");
      if (types.length > 0) {
        filteredData = filteredData.filter((mutation) =>
          types.includes(mutation.type)
        );
      }
    }

    if (search) {
      filteredData = filteredData.filter((mutation) =>
        mutation.keterangan.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (startDate && endDate) {
      // Logika baru untuk menangani ISO string
      const start = new Date(startDate);
      const end = new Date(endDate);

      filteredData = filteredData.filter((mutation) => {
        const mutationDate = new Date(mutation.tanggal);
        return mutationDate >= start && mutationDate <= end;
      });
    }

    const data = filteredData;

    return HttpResponse.json({
      data: data,
      totalItems: data.length,
      currentPage: 1,
      totalPages: 1,
    });
  }),
];
