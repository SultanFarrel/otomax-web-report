import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { useAdminAuthStore } from "@/store/adminAuthStore";

const API_PROTOCOL = "http";
const API_PORT = "4000";

// Dapatkan hostname dari URL browser saat ini (misalnya, "kliena.webreport.com")
const currentHostname =
  typeof window !== "undefined" ? window.location.hostname : "";

const baseURL = `${API_PROTOCOL}://${currentHostname}:${API_PORT}/api`;

export const apiClient = axios.create({
  baseURL: baseURL,
});

apiClient.interceptors.request.use(
  (config) => {
    const isAdminRoute = window.location.pathname.startsWith("/adm");

    // URL publik yang tidak akan pernah dimodifikasi
    const publicUrls = ["/webreport/me", "/auth/login"];

    if (publicUrls.some((url) => config.url?.includes(url))) {
      return config;
    }

    if (isAdminRoute) {
      const adminToken = useAdminAuthStore.getState().adminToken;
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }
      // Tambahkan prefix /adm ke semua request non-publik di rute admin MOCK
      config.url = `/mock/adm${config.url}`;
    } else {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const isLoginRequest = error.config.url?.includes("/auth/login");
      if (error.response.status === 401 && !isLoginRequest) {
        const responseData = error.response.data;
        const isAdminRoute = window.location.pathname.startsWith("/adm");

        // Hapus token yang tidak valid sebelum redirect
        if (isAdminRoute) {
          localStorage.removeItem("adminAuthToken");
          useAdminAuthStore.setState({ adminToken: null });
        } else {
          localStorage.removeItem("authToken");
          useAuthStore.setState({ token: null });
        }

        if (responseData && responseData.error === "SESSION_EXPIRED") {
          window.location.href = "/session-expired";
        }
      }
    }
    return Promise.reject(error);
  }
);
