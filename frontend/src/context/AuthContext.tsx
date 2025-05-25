import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

type User = {
  id_usuario: number;
  nombre: string;
  username: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (nombre: string, email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await api.get('/auth/profile');
          setUser(response.data);
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Intentando login con:", { username, password });
      const response = await api.post('/auth/login', { username, password });
      localStorage.setItem('authToken', response.data.token);
      setUser(response.data.user);
      console.log("Login exitoso, redirigiendo...");
      // Solo navega aquí
      navigate('/reserva');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (nombre: string, email: string, username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/register', { nombre, email, username, password });
      await login(username, password); // Auto-login después del registro
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      loading,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
