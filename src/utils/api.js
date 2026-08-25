import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const isAuthEndpoint = config.url && (
      config.url.includes("/users/login") ||
      config.url.includes("/users/register") ||
      config.url.includes("/users/google") ||
      config.url.includes("/users/otp") ||
      config.url.includes("/users/verify-otp")
    );

    const token = localStorage.getItem("token");
    if (token && !isAuthEndpoint && !config.headers?.Authorization) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const msg = error.response.data?.message || "";
      if (msg.includes("Invalid or expired token") || msg.includes("Unauthorized")) {
        localStorage.removeItem("token");
      }
    }
    return Promise.reject(error);
  }
);

export default api;