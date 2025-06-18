// api2m.ts (actualizado)
import axios from "axios";

const instance = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 10000
});


instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
