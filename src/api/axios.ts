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
    config.headers["X-Client-Subdomain"] = "subdomaina"; // DELETE THIS FOR PRODUCTION
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
