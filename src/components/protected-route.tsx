import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Spinner } from "@heroui/spinner";

const ProtectedRoute = () => {
  const token = useAuthStore((state) => state.token);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  // Jika store belum selesai memeriksa token, tampilkan loading
  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner label="Memuat sesi..." size="lg" />
      </div>
    );
  }

  // Jika sudah selesai dan tidak ada token, arahkan ke login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Jika sudah selesai dan ada token, tampilkan halaman
  return <Outlet />;
};

export default ProtectedRoute;
