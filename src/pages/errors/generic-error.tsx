import React from "react";
import { Button } from "@heroui/button";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

export default function GenericErrorPage() {
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
        <ExclamationCircleIcon className="h-12 w-12 text-danger mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Terjadi Kesalahan</h1>
        <p className="text-default-500 mb-6">
          Aplikasi tidak menerima respons yang valid dari server. Silakan coba
          beberapa saat lagi.
        </p>
        <Button
          color="primary"
          fullWidth
          onPress={() => (window.location.href = "/")}
        >
          Kembali ke Halaman Utama
        </Button>
      </div>
    </div>
  );
}
