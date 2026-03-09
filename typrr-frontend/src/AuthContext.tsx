import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { apiClient, setAccessToken } from './api';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 BOOTSTRAP AUTH ON APP START
  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const refreshResponse = await apiClient.refresh();
        setAccessToken(refreshResponse.accessToken);

        const profile = await apiClient.getProfile();
        setUser(profile.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiClient.login(email, password);
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const register = async (
    email: string,
    username: string,
    password: string
  ) => {
    const data = await apiClient.register(email, username, password);
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const refreshUser = async () => {
    try {
      const response = await apiClient.getProfile();
      setUser(response.data.user);
    } catch {
      await logout();
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch {}
    setAccessToken(null);
    setUser(null);
  };

  if (loading) {
    return null; // możesz tu dać spinner jeśli chcesz
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        refreshUser,
        isAuthenticated: !!user,
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