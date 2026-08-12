import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';

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
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setAuth({ user, isAuthenticated: true });
    }
    
    // Initialize default users if not exists
    initializeDefaultUsers();
  }, []);

  const initializeDefaultUsers = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) {
      const defaultUsers: User[] = [
        {
          id: '1',
          email: 'admin@hospital.com',
          password: 'admin123',
          role: 'admin',
          name: 'Hospital Admin',
          phone: '+1-555-0001',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          email: 'doctor@hospital.com',
          password: 'doctor123',
          role: 'doctor',
          name: 'Dr. Sarah Johnson',
          phone: '+1-555-0002',
          specialization: 'Cardiology',
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          email: 'receptionist@hospital.com',
          password: 'receptionist123',
          role: 'receptionist',
          name: 'Emma Davis',
          phone: '+1-555-0003',
          createdAt: new Date().toISOString(),
        },
        {
          id: '4',
          email: 'patient@hospital.com',
          password: 'patient123',
          role: 'patient',
          name: 'John Smith',
          phone: '+1-555-0004',
          address: '123 Main St, City, State 12345',
          dateOfBirth: '1985-06-15',
          gender: 'male',
          emergencyContact: '+1-555-9999',
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
  };

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