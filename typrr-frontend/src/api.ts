import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('typrr_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

export const apiClient = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (email: string, username: string, password: string) =>
    api.post('/auth/register', { email, username, password }),

  getProfile: () => api.get('/auth/profile'),

  saveAttempt: (data: AttemptData) => api.post('/attempts', data),

  getUserAttempts: (params?: { limit?: number; language?: string; difficulty?: string }) =>
    api.get('/attempts', { params }),

  getUserStats: () => api.get('/attempts/stats'),

  getGlobalLeaderboard: (params?: { language?: string; difficulty?: string; limit?: number }) =>
    api.get('/leaderboard', { params }),

  getLanguageLeaderboard: (language: string, params?: { limit?: number }) =>
    api.get(`/leaderboard/language/${language}`, { params }),
  updateProfile: async (data: { username?: string; email?: string }) => {
    const response = await api.put('/users/me', data);
    return response.data;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await api.put('/users/me/password', data);
    return response.data;
  },
};