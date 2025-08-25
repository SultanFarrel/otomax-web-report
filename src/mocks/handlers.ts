// sultanfarrel/otomax-web-report/otomax-web-report-new-api/src/mocks/handlers.ts
import { http, HttpResponse } from "msw";
import { allDownlines } from "./data/downlines";
import {
  mockTransactions,
  mockDownlineTransactions,
} from "./data/transactions";
import { mockProducts } from "./data/products";
import { mockBalanceMutations } from "./data/balanceMutations";

const API_PROTOCOL = "http";
const API_PORT = "4001";
const currentHostname =
  typeof window !== "undefined" ? window.location.hostname : "localhost";
const baseURL = `${API_PROTOCOL}://${currentHostname}:${API_PORT}/api`;

export const handlers = [
  http.post(`${baseURL}/auth/login`, () => {
    return HttpResponse.json({
      token: "mocked_user_token",
    });
  }),

  http.get(`${baseURL}/reseller/me`, () => {
    return HttpResponse.json({
      kode: "RES001",
      nama: "Reseller Mock",
      saldo: 1000000,
      komisi: 15000,
      poin: 753,
    });
  }),

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

  http.get(`${baseURL}/mutasi/recent`, () => {
    return HttpResponse.json({
      recentMutasi: mockBalanceMutations.slice(0, 10),
    });
  }),

  http.get(`${baseURL}/transaksi/recent`, () => {
    return HttpResponse.json({
      recentTransactions: mockTransactions.slice(0, 10),
    });
  }),

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

    return HttpResponse.json({
      data: filteredData,
    });
  }),

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
    if (status) {
      filteredData = filteredData.filter(
        (trx) => trx.status === parseInt(status)
      );
    }
    if (status_lt) {
      filteredData = filteredData.filter(
        (trx) => trx.status < parseInt(status_lt)
      );
    } else if (status) {
      filteredData = filteredData.filter(
        (trx) => trx.status === parseInt(status)
      );
    }

    return HttpResponse.json({
      data: filteredData,
    });
  }),

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
      filteredData = filteredData.filter(
        (trx) => trx.status < parseInt(status_lt)
      );
    } else if (status) {
      filteredData = filteredData.filter(
        (trx) => trx.status === parseInt(status)
      );
    }

    return HttpResponse.json({
      data: filteredData,
    });
  }),

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

    return HttpResponse.json({
      data: filteredData,
      totalItems: filteredData.length,
    });
  }),

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
