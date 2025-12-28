import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/api/axios';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userData: User = {
        id: payload['nameid'] || '', // Claim from API
        email: payload['email'] || '',
        name: payload['unique_name'] || 'User',
        role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'user',
      };
      setUser(userData);
    }
    setIsLoading(false);
  }, []);

  // Login method
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const token = res.data.token;
      localStorage.setItem('token', token);

      const payload = JSON.parse(atob(token.split('.')[1]));
      const userData: User = {
        id: payload['nameid'] || '',
        email: payload['email'] || email,
        name: payload['unique_name'] || 'User',
        role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'user',
      };

      setUser(userData);
      return true;
    } catch (err) {
      console.error('Login failed', err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role.toLowerCase() === 'admin',
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
