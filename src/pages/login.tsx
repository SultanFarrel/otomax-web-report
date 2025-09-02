import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useAuthStore } from "@/store/authStore";
import { useSiteStore } from "@/store/siteStore";
import {
  UserIcon,
  LockClosedIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";

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
        className="w-full max-w-sm p-8 space-y-4 bg-content1 rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-bold text-center mb-6">
          {siteInfo?.judul ? siteInfo.judul : "Web Report"}
        </h1>
        <Input
          isRequired
          classNames={{
            inputWrapper: "focus-within:ring-1 focus-within:ring-primary",
          }}
          placeholder="Kode Reseller"
          labelPlacement="outside"
          value={kodeRs}
          onValueChange={setKodeRs}
          startContent={
            <UserIcon className="h-5 w-5 text-default-400 pointer-events-none shrink-0" />
          }
        />
        <Input
          isRequired
          classNames={{
            inputWrapper: "focus-within:ring-1 focus-within:ring-primary",
          }}
          placeholder="Nomor Hp"
          labelPlacement="outside"
          value={nomorHp}
          onValueChange={setNomorHp}
          startContent={
            <DevicePhoneMobileIcon className="h-5 w-5 text-default-400 pointer-events-none shrink-0" />
          }
        />
        <Input
          isRequired
          classNames={{
            mainWrapper: "mb-6",
            inputWrapper: "focus-within:ring-1 focus-within:ring-primary",
          }}
          type="password"
          placeholder="PIN"
          labelPlacement="outside"
          value={pin}
          onValueChange={setPin}
          startContent={
            <LockClosedIcon className="h-5 w-5 text-default-400 pointer-events-none shrink-0" />
          }
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button fullWidth type="submit" color="primary" isLoading={isLoading}>
          Login
        </Button>
      </form>
    </div>
  );
}
