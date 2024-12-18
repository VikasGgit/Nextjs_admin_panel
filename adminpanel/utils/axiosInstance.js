import axios from "axios";

// Base Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://wallet-api-xx8c.onrender.com/api",
  headers: { "Content-Type": "application/json" },
});

// Attach Token Interceptor
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

export default axiosInstance;
