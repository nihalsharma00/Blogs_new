import axios from 'axios';
import { env } from '../env';

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
      originalRequest._retry = true;
      try {
        const { data } = await api.post('/auth/refresh');
        const token = data.data.accessToken;
        
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        
        const { useAuthStore } = await import('../store/authStore');
        useAuthStore.getState().setToken(token);
        
        return api(originalRequest);
      } catch (err) {
        const { useAuthStore } = await import('../store/authStore');
        useAuthStore.getState().logout();
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);
