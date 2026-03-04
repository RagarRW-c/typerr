import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';

const API_URL = '/api';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
  const savedToken = sessionStorage.getItem('typrr_token');
  const savedUser = sessionStorage.getItem('typrr_user');

  if (savedToken && savedUser) {
    setToken(savedToken);
    setUser(JSON.parse(savedUser));
  }
}, []);

useEffect(() => {
  if (!token) return;

  const interval = setInterval(() => {
    refreshUser();
  }, 5 * 60 * 1000); // co 5 minut

  return () => clearInterval(interval);
}, [token]);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { token: newToken, user: newUser } = response.data;

      setToken(newToken);
      setUser(newUser);

      sessionStorage.setItem('typrr_token', newToken);
      sessionStorage.setItem('typrr_user', JSON.stringify(newUser));
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };

  const register = async (email: string, username: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        username,
        password,
      });

      const { token: newToken, user: newUser } = response.data;

      setToken(newToken);
      setUser(newUser);

      sessionStorage.setItem('typrr_token', newToken);
      sessionStorage.setItem('typrr_user', JSON.stringify(newUser));    
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  };

  const refreshUser = async () => {
    try {
      if (!token) return;
      
      const response = await axios.get(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedUser = response.data;
      setUser(updatedUser);
      sessionStorage.setItem('typrr_user', JSON.stringify(updatedUser));
    } catch (error: any) {
      console.error('Failed to refresh user:', error);
      // If refresh fails with 401, logout
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem('typrr_token');
    sessionStorage.removeItem('typrr_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        refreshUser,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
