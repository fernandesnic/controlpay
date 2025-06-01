import axios from "axios";

export const api = axios.create({
  baseURL:
    (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333") + "/api",
});

// Interceptor para logs de requisição
api.interceptors.request.use((config) => {
  console.log("Fazendo requisição para:", config.url);
  return config;
});

// Interceptor para logs de resposta
api.interceptors.response.use(
  (response) => {
    console.log("Resposta recebida:", response.status);
    return response;
  },
  (error) => {
    console.error("Erro na requisição:", error.response?.status, error.message);
    return Promise.reject(error);
  },
);
