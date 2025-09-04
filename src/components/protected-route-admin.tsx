import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { Spinner } from "@heroui/spinner";

const ProtectedRouteAdmin = () => {
  const token = useAdminAuthStore((state) => state.adminToken);
  const isInitialized = useAdminAuthStore((state) => state.isInitialized);

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner label="Memuat sesi admin..." size="lg" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/adm/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRouteAdmin;
