import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const API_PROTOCOL = "http"; // Ganti menjadi 'https' jika sudah menggunakan SSL di produksi
const API_PORT = "4001";

// Dapatkan hostname dari URL browser saat ini (misalnya, "kliena.webreport.com")
const currentHostname =
  typeof window !== "undefined" ? window.location.hostname : "";

const baseURL = `${API_PROTOCOL}://${currentHostname}:${API_PORT}/api`;

export const apiClient = axios.create({
  baseURL: baseURL,
});

apiClient.interceptors.request.use(
  (config) => {
    // Ambil token langsung dari store
    const token = useAuthStore.getState().token;
    if (token) {
      // Atur header Authorization dengan format Bearer Token
      config.headers.Authorization = `Bearer ${token}`;
    }
    // config.headers["X-Client-Host"] = "otomax.report.web.id"; // DELETE THIS FOR PRODUCTION
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
      if (error.response.status === 401 && error.config.url !== "/auth/login") {
        const responseData = error.response.data;
        if (responseData && responseData.error === "SESSION_EXPIRED") {
          window.location.href = "/session-expired";
        } else {
          window.location.href = "/session-expired";
        }
      }

      //   if (typeof error.response.data !== "object") {
      //     if (window.location.pathname !== "/error") {
      //       window.location.href = "/error";
      //     }
      //   }
      // } else if (error.request) {
      //   if (window.location.pathname !== "/error") {
      //     window.location.href = "/error";
      //   }
    }

    // Kembalikan error agar bisa ditangani oleh fungsi pemanggil
    return Promise.reject(error);
  }
);
