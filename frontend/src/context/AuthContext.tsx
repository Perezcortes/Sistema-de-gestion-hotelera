import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

type User = {
  id_usuario: number;
  nombre: string;
  username: string;
  email: string;
  id_rol: number;
  nombre_rol: string;
};

type AuthContextType = {
  user: User | null;
  authToken: string | null;
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
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Verificar autenticación al montar
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          setLoading(true);
          const response = await api.get('/auth/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
          setAuthToken(token);
        } catch (err) {
          logout();
        } finally {
          setLoading(false);
        }
      }
    };
    verifyAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user } = response.data;

      if (!user?.id_rol) {
        throw new Error('Datos de usuario incompletos');
      }

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      setAuthToken(token);
      setUser(user);

      // Redirección basada en el rol
      switch (user.id_rol) {
        case 1:
          navigate('/reserva'); break;
        case 2:
        case 6:
          navigate('/admin'); break;
        case 3:
          navigate('/soporte'); break;
        case 4:
          navigate('/contador'); break;
        case 5:
          navigate('/mantenimiento'); break;
        default:
          navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al iniciar sesión');
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
      await login(username, password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setAuthToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authToken,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loading,
        error,
      }}
    >
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
