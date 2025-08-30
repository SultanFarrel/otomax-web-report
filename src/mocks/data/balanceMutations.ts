const randomDate = (
  start = new Date(new Date().setMonth(new Date().getMonth() - 3)),
  end = new Date()
) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).toISOString();
};

const mutationTypes = ["K", "T", "G", "O", "1", "2", "A", "Z", "B", "+"];
const productCodes = ["PULSA10", "PLN20K", "DATA5GB", "GAME100", "GOPAY50K"];

export const mockBalanceMutations = Array.from({ length: 500 }, (_, i) => {
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
