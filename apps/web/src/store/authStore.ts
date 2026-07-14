import { create } from 'zustand';
import { api } from '../lib/api';

interface User {
  id: string;
  email: string;
  username: string;
  roles: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setToken: (token: string) => void;
  setUser: (user: User | null) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
  login: (token, user) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    set({ token, user, isLoading: false });
  },
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {}
    delete api.defaults.headers.common['Authorization'];
    set({ user: null, token: null, isLoading: false });
  },
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const token = get().token;
      if (!token) {
        const refreshRes = await api.post('/auth/refresh');
        const newToken = refreshRes.data.data.accessToken;
        set({ token: newToken });
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      } else {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      const res = await api.get('/users/me');
      set({ user: res.data.data, isLoading: false });
    } catch (error) {
      set({ user: null, token: null, isLoading: false });
    }
  },
}));
