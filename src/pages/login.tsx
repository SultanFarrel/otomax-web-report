import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useAuthStore } from "@/store/authStore";
import { useSiteStore } from "@/store/siteStore";

export default function LoginPage() {
  const [kodeRs, setKodeRs] = useState("");
  const [nomorHp, setNomorHp] = useState("");
  const [pin, setPin] = useState("");
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const { siteInfo, fetchSiteInfo } = useSiteStore();

  useEffect(() => {
    const root = document.documentElement;
    const originalClassName = root.className;

    root.classList.add("dark");
    root.classList.remove("light");

    return () => {
      root.className = originalClassName;
    };
  }, []);

  useEffect(() => {
    fetchSiteInfo();
  }, [fetchSiteInfo]);

  useEffect(() => {
    if (siteInfo?.judul) {
      document.title = `${siteInfo.judul}`;
    }
  }, [siteInfo]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const loginSuccess = await login(kodeRs, nomorHp, pin);
    if (loginSuccess) {
      navigate("/"); // Arahkan pengguna setelah login berhasil
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm p-8 space-y-6 bg-content1 rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-bold text-center">
          {siteInfo?.judul ? siteInfo.judul : "Web Report"}
        </h1>
        <Input
          isRequired
          label="Kode Reseller"
          placeholder="Masukkan kode Anda"
          value={kodeRs}
          onValueChange={setKodeRs}
        />
        <Input
          isRequired
          label="Nomor HP"
          placeholder="Masukkan nomor HP terdaftar"
          value={nomorHp}
          onValueChange={setNomorHp}
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
