import { clearAuthData, getToken, isBrowser } from '@/services/api/tokenManager';
import axios, { AxiosError } from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Requisição: Adiciona o token em cada chamada
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Resposta: Lida com erros de autenticação
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const isLoginRequest = error.config?.url?.endsWith('/login');

    if (error.response?.status === 401 && !isLoginRequest) {
      clearAuthData();
      if (isBrowser()) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
