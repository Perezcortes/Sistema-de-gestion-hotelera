import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminDashboardPage from './pages/AdminDashboardPage';
import Home from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ReservaPage from './pages/ReservaPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const location = useLocation();
  // Ocultar navbar y footer en login, register y cualquier ruta que empiece con /admin
  const hideLayout =
    ['/login', '/register'].some(path => location.pathname.startsWith(path)) ||
    location.pathname.startsWith('/admin');

  return (
    <>
      {!hideLayout && <Navbar />}
      <main className="min-h-[calc(100vh-160px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/reserva"
            element={
              <ProtectedRoute>
                <ReservaPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
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
