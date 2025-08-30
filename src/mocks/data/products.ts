const operatorCodes = ["TSEL", "ISAT", "XL", "AXIS", "SMART"];
const productTypes = ["Pulsa", "Data", "Token PLN", "Voucher Game", "e-Money"];

export const mockProducts = Array.from({ length: 150 }, (_, i) => {
  const harga_beli = Math.floor(Math.random() * 50000) + 5000;
  const harga_jual = harga_beli + Math.floor(Math.random() * 1000) + 250;
  const status = Math.floor(Math.random() * 4); // 0: Aktif, 1: Tidak Aktif, 2: Kosong, 3: Gangguan

  return {
    kode: `P${1000 + i}`,
    nama: `${productTypes[i % productTypes.length]} ${Math.floor(
      Math.random() * 100
    )}K`,
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
