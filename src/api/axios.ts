import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const API_PROTOCOL = "http"; // Ganti menjadi 'https' jika sudah menggunakan SSL di produksi
const API_PORT = "4000";

// Dapatkan hostname dari URL browser saat ini (misalnya, "kliena.webreport.com")
const currentHostname =
  typeof window !== "undefined" ? window.location.hostname : "";

// Bangun baseURL secara dinamis.
// Ini akan menghasilkan 'http://kliena.webreport.com:4000/api'
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
    config.headers["X-Client-Subdomain"] = "metropln"; // DELETE THIS FOR PRODUCTION
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Cek jika error memiliki respons dan statusnya 401
    if (error.response && error.response.status === 401) {
      // **KONDISI PENTING**: Cek apakah URL bukan dari endpoint login
      if (error.config.url !== "/auth/login") {
        // (Opsional tapi direkomendasikan) Cek body respons jika ada
        const responseData = error.response.data;
        if (responseData && responseData.error === "SESSION_EXPIRED") {
          // Arahkan ke halaman sesi berakhir
          window.location.href = "/session-expired";
        }
      }
    }
    // Kembalikan error agar bisa ditangani oleh fungsi pemanggil (seperti di authStore)
    return Promise.reject(error);
  }
);
