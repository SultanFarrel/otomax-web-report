import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const apiClient = axios.create({
  baseURL: "http://192.168.10.29:4000/api",
});

apiClient.interceptors.request.use(
  (config) => {
    // Ambil token langsung dari store
    const token = useAuthStore.getState().token;
    if (token) {
      // Atur header Authorization dengan format Bearer Token
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
