import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import LoginModal from './components/layout/LoginModal'

// Tus componentes existentes
import { TradingHeader } from './components/layout/TradingHeader'
import { QuotesCarousel } from './components/markets/QuotesCarousel'
import { LiveStreamsGrid } from './components/video/LiveStreamsGrid'
import { EconomicIndicators } from './components/markets/EconomicIndicators'
import { FinancialDashboard } from './components/markets/FinancialDashboard'
import { Notice } from './components/charts/Notice'
import { TradingViewCharts } from './components/charts/TradingViewCharts'
import TreemapDashboard from './components/charts/TreemapDashboard'
import EconomicDataBlock from './components/markets/EconomicDataBlock'
import AdSpace from './components/ads/AdSpace'
import { FloatingEduButton, MacroExplainer } from './components/markets/MacroExplainer'
import { 
  Users,
  Key,
  Mail,
  Shield,
  Search,
  Filter,
  Eye,
  EyeOff,
  RefreshCw,
  Copy,
  Plus,
  Trash2,
  AlertCircle
} from 'lucide-react';
// Componente de gestión de usuarios (solo para admin)
import UserManagement from './components/admin/UserManagement'

import './App.css'

// ============================================
// COMPONENTE PROTECTED ROUTE
// ============================================
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, isChecking } = useAuth();
  const location = useLocation();

  // Mientras verifica
  if (isChecking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400 font-mono">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado
  if (!isAuthenticated) {
    sessionStorage.setItem('redirectAfterLogin', location.pathname);
    return <Navigate to="/login" replace />;
  }

  // Si requiere admin pero no lo es
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center p-8 bg-gray-900/50 rounded-xl border border-red-800/30 font-mono">
          <div className="text-red-400 text-4xl mb-4">⛔</div>
          <h2 className="text-xl font-bold text-white mb-2">Acceso Restringido</h2>
          <p className="text-gray-400">No tienes permisos de administrador.</p>
        </div>
      </div>
    );
  }

  return children;
};

// ============================================
// COMPONENTE MAIN LAYOUT
// ============================================
const MainLayout = ({ children, showHeader = true }) => {
  const { isAuthenticated, userRole, logout, getSessionTimeLeft } = useAuth();
  const [timeLeft, setTimeLeft] = useState(getSessionTimeLeft());

  // Actualizar tiempo de sesión
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getSessionTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, [getSessionTimeLeft]);

  const formatTime = (seconds) => {
    if (seconds >= 3600) {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${mins}m`;
    } else if (seconds >= 60) {
      return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Floating Education Button */}
      <FloatingEduButton />
      <MacroExplainer />

      {/* Header con info de sesión */}
      {showHeader && (
        <>
          <div className="bg-gray-900/80 border-b border-gray-800">
            <div className="container mx-auto px-4 py-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${timeLeft > 300 ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                    <span className="text-gray-300">
                      Sesión: <span className="font-bold">{formatTime(timeLeft)}</span>
                    </span>
                  </div>
                  <span className="text-gray-500">|</span>
                  <span className="text-gray-400">
                    Usuario: <span className="text-blue-400">{isAuthenticated ? userRole === 'admin' ? '👑 Admin' : '👤 Cliente' : 'No autenticado'}</span>
                  </span>
                </div>
                
                {isAuthenticated && (
                  <button
                    onClick={logout}
                    className="px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 hover:text-red-200 rounded border border-red-700/30 transition-colors text-xs"
                  >
                    Cerrar sesión
                  </button>
                )}
              </div>
            </div>
          </div>
          <TradingHeader />
        </>
      )}

      {/* Contenido principal */}
      {children}
    </div>
  );
};

// ============================================
// PÁGINA DE LOGIN
// ============================================
// ============================================
// PÁGINA DE LOGIN - VERSIÓN CORREGIDA (POSICIÓN VERTICAL)
// ============================================
const LoginPage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/dashboard';
    sessionStorage.removeItem('redirectAfterLogin');
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000000',
      display: 'flex',
      alignItems: 'flex-start', // Cambiado de 'center' a 'flex-start'
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      paddingTop: '10vh' // Añadir padding top para subirlo
    }}>
      
      {/* Efectos de fondo */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        background: `
          radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)
        `,
        zIndex: 1
      }}></div>
      
      {/* Contenedor principal - SUBIDO */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '420px',
        padding: '0 1rem',
        marginTop: '5vh' // Margen superior para ajustar posición
      }}>
        <LoginModal />
      </div>
      
      {/* Dashboard en segundo plano (bloqueado) - REBAJADO */}
      <div style={{
        position: 'absolute',
        top: '40vh', // Comienza más abajo
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
        filter: 'blur(12px)',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        {/* Contenido simplificado del dashboard */}
        <div style={{
          backgroundColor: '#000',
          height: '100%'
        }}>
          {/* Solo líneas básicas */}
          <div style={{
            height: '60px',
            backgroundColor: 'rgba(30, 41, 59, 0.3)',
            marginBottom: '20px'
          }}></div>
          <div style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div style={{
              flex: '7',
              height: '200px',
              backgroundColor: 'rgba(30, 41, 59, 0.3)'
            }}></div>
            <div style={{
              flex: '3',
              height: '200px',
              backgroundColor: 'rgba(30, 41, 59, 0.3)'
            }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// DASHBOARD PRINCIPAL
// ============================================
const DashboardPage = () => {
  const { isAdmin} = useAuth();
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Panel admin SOLO visible si:
  // 1. Es admin
  // 2. Y activó manualmente el panel
  const shouldShowAdminPanel = isAdmin && showAdminPanel;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 ">
        
        {/* === BOTÓN PARA ACTIVAR PANEL ADMIN (SOLO PARA ADMIN) === */}
        {isAdmin && !showAdminPanel && (
          <div className="mb-4 flex justify-end">
<button
  onClick={() => setShowAdminPanel(true)}
  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm rounded-lg hover:opacity-90 transition-opacity"
>
  🔓 Mostrar Panel de Administración
</button>
          </div>
        )}

        {/* === PANEL DE ADMINISTRACIÓN (SOLO SI ESTÁ ACTIVADO) === */}
        {shouldShowAdminPanel && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">🔧 Panel de Administración</h2>
              <button
                onClick={() => setShowAdminPanel(false)}
                className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded hover:bg-gray-700"
              >
                Ocultar Panel
              </button>
            </div>
            <UserManagement />
          </div>
        )}

        <div className="mb-8 border-b-35 border-transparent">
          <QuotesCarousel />
        </div>
        
        <div className="flex flex-row gap-6 ">
          
          {/* COLUMNA IZQUIERDA (70%) */}
          <div className="w-7/10 border-r-12 border-transparent border-b-25 border-transparent">
            <LiveStreamsGrid />
            
            {/* 📊 INDICADORES ECONÓMICOS */}
            <EconomicIndicators />
            
            {/* ⭐⭐ ADSPACE - JUSTO AQUÍ ⭐⭐ */}
            <AdSpace />
            
            <FinancialDashboard/>
            <div className="w-3/10 ml-12 pl-12 border-b-25 border-transparent"></div>
            <EconomicDataBlock/>
          </div>
          
          {/* COLUMNA DERECHA (30%) */}
          <div className="w-3/10 ml-12 pl-12 border-b-25 border-transparent">
            <Notice /> 
            <TreemapDashboard />
          </div>
        </div>
        
        {/* GRAFICOS TRADINGVIEW (debajo de AdSpace) */}
        <TradingViewCharts />
      </div>
    </MainLayout>
  );
};

// ============================================
// PÁGINA 404
// ============================================
const NotFoundPage = () => (
  <MainLayout>
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center font-mono">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <p className="text-xl text-gray-400 mb-8">Página no encontrada</p>
        <a 
          href="/dashboard" 
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Volver al Dashboard
        </a>
      </div>
    </div>
  </MainLayout>
);

// ============================================
// COMPONENTE APP PRINCIPAL
// ============================================
function App() {
  return (
    <Routes>
      {/* Ruta de login */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Ruta raíz redirige a dashboard */}
      <Route path="/" element={
        <ProtectedRoute>
          <Navigate to="/dashboard" replace />
        </ProtectedRoute>
      } />
      
      {/* Dashboard principal */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      
      {/* Panel admin (solo para administradores) */}
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin={true}>
          <MainLayout>
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold text-white mb-6">🔧 Panel de Administración Completo</h1>
              <UserManagement />
            </div>
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Ruta 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;