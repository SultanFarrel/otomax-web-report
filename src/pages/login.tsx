import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useAuthStore } from "@/store/authStore";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { useSiteStore } from "@/store/siteStore";
import {
  UserIcon,
  LockClosedIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

export default function LoginPage() {
  const location = useLocation();
  const isAdminLogin = location.pathname === "/adm/login";

  const navigate = useNavigate();
  const { siteInfo, fetchSiteInfo } = useSiteStore();

  // State untuk user
  const [kodeRs, setKodeRs] = useState("");
  const [nomorHp, setNomorHp] = useState("");
  const [pin, setPin] = useState("");

  // State untuk admin
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Ambil fungsi dan state dari kedua store
  const {
    login: userLogin,
    isLoading: isUserLoading,
    error: userError,
  } = useAuthStore();
  const {
    login: adminLogin,
    isLoading: isAdminLoading,
    error: adminError,
  } = useAdminAuthStore();

  const isLoading = isUserLoading || isAdminLoading;
  const error = userError || adminError;

  useEffect(() => {
    // Styling dan fetch site info
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
    fetchSiteInfo();
    return () => {
      document.documentElement.className = "";
    };
  }, [fetchSiteInfo]);

  useEffect(() => {
    if (siteInfo?.judul) document.title = siteInfo.judul;
  }, [siteInfo]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdminLogin) {
      const loginSuccess = await adminLogin(email, password);
      if (loginSuccess) navigate("/adm");
    } else {
      const loginSuccess = await userLogin(kodeRs, nomorHp, pin);
      if (loginSuccess) navigate("/");
    }
  };

  const renderAdminForm = () => (
    <>
      <Input
        isRequired
        type="email"
        placeholder="Email"
        value={email}
        onValueChange={setEmail}
        startContent={<EnvelopeIcon className="h-5 w-5 text-default-400" />}
      />
      <Input
        isRequired
        type="password"
        placeholder="Password"
        value={password}
        onValueChange={setPassword}
        startContent={<LockClosedIcon className="h-5 w-5 text-default-400" />}
      />
    </>
  );

  const renderUserForm = () => (
    <>
      <Input
        isRequired
        placeholder="Kode Reseller"
        value={kodeRs}
        onValueChange={setKodeRs}
        startContent={<UserIcon className="h-5 w-5 text-default-400" />}
      />
      <Input
        isRequired
        placeholder="Nomor Hp"
        value={nomorHp}
        onValueChange={setNomorHp}
        startContent={
          <DevicePhoneMobileIcon className="h-5 w-5 text-default-400" />
        }
      />
      <Input
        isRequired
        type="password"
        placeholder="PIN"
        value={pin}
        onValueChange={setPin}
        startContent={<LockClosedIcon className="h-5 w-5 text-default-400" />}
      />
    </>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm p-8 space-y-4 bg-content1 rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-bold text-center mb-6">
          {siteInfo?.judul || "Web Report"} {isAdminLogin && "(Admin)"}
        </h1>
        {isAdminLogin ? renderAdminForm() : renderUserForm()}
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button fullWidth type="submit" color="primary" isLoading={isLoading}>
          Login
        </Button>
      </form>
    </div>
  );
}
