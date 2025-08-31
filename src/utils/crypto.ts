import CryptoJS from "crypto-js";

export function hmacPinWithKode(pin: string, kodeReseller: string): string {
  return CryptoJS.HmacSHA256(pin, kodeReseller).toString(CryptoJS.enc.Hex);
}

export function hmacPinWithNoHp(pin: string, nomorHp: string): string {
  return CryptoJS.HmacSHA256(pin, nomorHp).toString(CryptoJS.enc.Hex);
}
