import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.SERVER_API_URL}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired - clear storage
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
    }
    return Promise.reject(error);
  }
);

export default api;
