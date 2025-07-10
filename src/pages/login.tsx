import React from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const [kodeRs, setKodeRs] = React.useState("");
  const [pin, setPin] = React.useState("");
  const { login, isLoading, error } = useAuthStore();

  React.useEffect(() => {
    const root = document.documentElement;
    // Simpan kelas tema asli sebelum diubah
    const originalClassName = root.className;

    // Paksa tema gelap dengan menambahkan kelas 'dark'
    root.classList.add("dark");
    // Hapus kelas light jika ada untuk menghindari konflik
    root.classList.remove("light");

    // Fungsi cleanup yang akan dijalankan saat komponen ditinggalkan
    return () => {
      // Kembalikan kelas ke kondisi semula
      root.className = originalClassName;
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(kodeRs, pin);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm p-8 space-y-6 bg-content1 rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-bold text-center">Web Report Login</h1>
        <Input
          isRequired
          label="Kode Reseller"
          placeholder="Masukkan kode Anda"
          value={kodeRs}
          onValueChange={setKodeRs}
        />
        <Input
          isRequired
          type="password"
          label="PIN"
          placeholder="Masukkan PIN Anda"
          value={pin}
          onValueChange={setPin}
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button fullWidth type="submit" color="primary" isLoading={isLoading}>
          Login
        </Button>
      </form>
    </div>
  );
}
