import axios from 'axios';
import type { AxiosError } from 'axios';

const API_URL = '/api';

// =============================
// In-memory access token
// =============================
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

// =============================
// Axios instance
// =============================
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // 🔥 konieczne do wysyłania refresh cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

// =============================
// Request interceptor
// =============================
api.interceptors.request.use((config: any) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// =============================
// Response interceptor (AUTO REFRESH)
// =============================
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !originalRequest?.url?.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await api.post('/auth/refresh');

        const newToken = (refreshResponse.data as any).accessToken;

        setAccessToken(newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// =============================
// Types
// =============================
export interface AttemptData {
  snippetId: string;
  language: string;
  difficulty: string;
  category: string;
  wpm: number;
  accuracy: number;
  errors: number;
  timeMs: number;
  mode: string;
}

// =============================
// API Client
// =============================
export const apiClient = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const token = response.data.accessToken;
    setAccessToken(token);
    return response.data;
  },

  register: async (email: string, username: string, password: string) => {
    const response = await api.post('/auth/register', {
      email,
      username,
      password,
    });
    const token = response.data.accessToken;
    setAccessToken(token);
    return response.data;
  },

  // 🔥 DODANE — potrzebne do bootstrap auth
  refresh: async () => {
    const response = await api.post('/auth/refresh');
    const token = response.data.accessToken;
    setAccessToken(token);
    return response.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
    setAccessToken(null);
  },

  getProfile: () => api.get('/auth/profile'),

  saveAttempt: (data: AttemptData) =>
    api.post('/attempts', data),

  getUserAttempts: (params?: {
    limit?: number;
    language?: string;
    difficulty?: string;
  }) =>
    api.get('/attempts', { params }),

  getUserStats: () => api.get('/attempts/stats'),

  getGlobalLeaderboard: (params?: {
    language?: string;
    difficulty?: string;
    limit?: number;
  }) =>
    api.get('/leaderboard', { params }),

  getLanguageLeaderboard: (
    language: string,
    params?: { limit?: number }
  ) =>
    api.get(`/leaderboard/language/${language}`, { params }),

  updateProfile: async (data: { username?: string; email?: string }) => {
    const response = await api.put('/users/me', data);
    return response.data;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await api.put('/users/me/password', data);
    return response.data;
  },
};