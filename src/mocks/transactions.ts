// src/mocks/transactions.ts

// Daftar status UID yang akan kita gunakan untuk generate data
const statusCycle = [20, 40, 1, 2, 3, 50, 52, 53, 55, 58];
const totalUniqueStatuses = statusCycle.length;

// Helper untuk menghasilkan data unik
const generateMockData = (page: number, pageSize: number) => {
  const data = [];
  const baseKode = 22738938 + (page - 1) * pageSize;

  for (let i = 0; i < pageSize; i++) {
    const trxDate = new Date();
    trxDate.setDate(trxDate.getDate() - (i + (page - 1) * pageSize));

    // Gunakan status dari array `statusCycle`
    const currentStatus =
      statusCycle[((page - 1) * pageSize + i) % totalUniqueStatuses];

    data.push({
      kode: baseKode + i,
      tgl_entri: trxDate.toISOString(),
      kode_produk: i % 2 === 0 ? "TSEL10" : "XDIS5",
      tujuan: `081234567${String(80 + i).padStart(2, "0")}`,
      kode_reseller: "KP0001",
      pengirim: "6281354175500",
      tipe_pengirim: "W",
      harga: 10500 + i * 15,
      status: currentStatus,
      harga_beli: 10200 + i * 15,
      saldo_awal: 250000 - i * 1000,
      sn: currentStatus === 20 ? `SN-MOCK${Date.now() + i}` : null,
      qty: 1,
      komisi: 0,
      poin: null,
      saldo_supplier: null,
      RowNum: ((page - 1) * pageSize + i + 1).toString(),
    });
  }
  return data;
};

// Data untuk 3 halaman, pastikan cukup untuk menampilkan semua status
export const mockTransactions = {
  1: generateMockData(1, 10),
  2: generateMockData(2, 10),
  3: generateMockData(3, 10),
};

export const totalItems = 30;
export const totalPages = 3;
