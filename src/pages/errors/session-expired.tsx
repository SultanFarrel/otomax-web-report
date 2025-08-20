import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/button";
import { useAuthStore } from "@/store/authStore";

export default function SessionExpiredPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const { token } = useAuthStore.getState();
    if (token) {
      localStorage.removeItem("authToken");
      useAuthStore.setState({ token: null });
    }

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    if (countdown === 0) {
      clearInterval(interval);
      navigate("/login");
    }

    return () => clearInterval(interval);
  }, [countdown, navigate]);

  const handleRedirectNow = () => {
    navigate("/login");
  };

  React.useEffect(() => {
    const root = document.documentElement;
    const originalClassName = root.className;

    root.classList.add("dark");
    root.classList.remove("light");

    return () => {
      root.className = originalClassName;
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="text-center p-8 bg-content1 rounded-lg shadow-md max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-4">Sesi Anda Berakhir</h1>
        <p className="text-default-500 mb-6">
          Sesi Anda telah berakhir karena tidak ada aktivitas. Silakan masuk
          kembali.
        </p>

        <Button
          color="primary"
          fullWidth
          onPress={handleRedirectNow}
          className="mb-4 mt-4"
        >
          Kembali ke Halaman Login
        </Button>

        <p className="text-sm text-default-400">
          Otomatis dalam {countdown} detik...
        </p>
      </div>
    </div>
  );
}
