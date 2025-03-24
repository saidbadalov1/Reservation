import axios from "axios";
import { storage } from "./storage.services";
import { SITE_URL } from "@/config";

// Axios instance oluştur (token olmadan)
const api = axios.create({
  baseURL: `${SITE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// İstek gönderilmeden önce token ekleyen interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await storage.getToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
