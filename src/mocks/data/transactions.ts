// sultanfarrel/otomax-web-report/otomax-web-report-new-api/src/mocks/data/transactions.ts
const randomDate = (
  start = new Date(new Date().setMonth(new Date().getMonth() - 3)),
  end = new Date()
) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).toISOString();
};

const productCodes = ["PULSA10", "PLN20K", "DATA5GB", "GAME100", "GOPAY50K"];
const statuses = [1, 20, 40, 50, 2]; // Proses, Sukses, Gagal, Dibatalkan, Menunggu Jawaban

export const mockTransactions = Array.from({ length: 200 }, (_, i) => {
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

const downlineResellers = ["DL-A", "DL-B", "DL-C", "DL-D"];
export const mockDownlineTransactions = Array.from({ length: 150 }, (_, i) => {
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
