import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { Spinner } from "@heroui/spinner";

interface ProtectedRouteProps {
  isAdmin?: boolean;
}

const ProtectedRoute = ({ isAdmin = false }: ProtectedRouteProps) => {
  const { token, isInitialized } = useAuthStore();
  const { adminToken, isInitialized: isAdminInitialized } = useAdminAuthStore();

  if (isAdmin) {
    if (!isAdminInitialized) {
      return (
        <div className="flex justify-center items-center h-screen">
          <Spinner label="Memuat sesi admin..." size="lg" />
        </div>
      );
    }
    if (!adminToken) {
      return <Navigate to="/adm/login" replace />;
    }
  } else {
    if (!isInitialized) {
      return (
        <div className="flex justify-center items-center h-screen">
          <Spinner label="Memuat sesi..." size="lg" />
        </div>
      );
    }
    if (!token) {
      return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
