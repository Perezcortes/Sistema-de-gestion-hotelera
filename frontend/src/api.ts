// api.ts (actualizado)
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  timeout: 10000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export const getTickets = () => api.get('/soporte');
export const createTicket = (data: any) => api.post('/soporte', data);

export default api;
