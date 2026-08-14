import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { initializeSeedData } from '../utils/seedData';

interface AuthContextType {
  auth: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Initialize seed data if LocalStorage is unpopulated
    initializeSeedData();

    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setAuth({ user, isAuthenticated: true });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      setAuth({ user, isAuthenticated: true });
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuth({ user: null, isAuthenticated: false });
    localStorage.removeItem('currentUser');
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<boolean> => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.find(u => u.email === userData.email)) {
      return false;
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};