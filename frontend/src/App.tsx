// App.tsx
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import AdminDashboardPage from './pages/AdminDashboardPage';
import RecepcionistaDashboardPage from './pages/RecepcionistaDashboardPage';
import ContadorDashboardPage from './pages/ContadorDashboardPage';
import SoporteDashboardPage from './pages/SoporteDashboardPage';
import MantenimientoDashboardPage from './pages/MantenimientoDashboardPage';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ReservaPage from './pages/ReservaPage';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import DashboardLayout from './DashboardLayout';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: number[] }> = ({
  children,
  roles,
}) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && user && !roles.includes(user.id_rol)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const location = useLocation();

  // Rutas donde no quieres mostrar Navbar ni Footer (login, registro y dashboards)
  const hideLayout = ['/login', '/register'].includes(location.pathname) || location.pathname.startsWith('/admin') || location.pathname.startsWith('/contador') || location.pathname.startsWith('/soporte') || location.pathname.startsWith('/mantenimiento');

  return (
    <>
      {!hideLayout && <Navbar />}

      <main className="min-h-[calc(100vh-160px)]">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Ruta protegida con Navbar y Footer (ejemplo: reserva) */}
          <Route
            path="/reserva"
            element={
              <ProtectedRoute roles={[1]}>
                <ReservaPage />
              </ProtectedRoute>
            }
          />

          {/* Rutas de dashboard protegidas dentro del layout exclusivo */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute roles={[2]}>
                <DashboardLayout>
                  <AdminDashboardPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route 
            path="/recepcionista/*"
            element={
              <ProtectedRoute roles={[6]}>
                <DashboardLayout>
                  <RecepcionistaDashboardPage/>
                </DashboardLayout>
              </ProtectedRoute>
              }>
          </Route>
          <Route
            path="/contador/*"
            element={
              <ProtectedRoute roles={[4]}>
                <DashboardLayout>
                  <ContadorDashboardPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/soporte/*"
            element={
              <ProtectedRoute roles={[3]}>
                <DashboardLayout>
                  <SoporteDashboardPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mantenimiento/*"
            element={
              <ProtectedRoute roles={[5]}>
                <DashboardLayout>
                  <MantenimientoDashboardPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Ruta catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
      <ToastContainer />
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
