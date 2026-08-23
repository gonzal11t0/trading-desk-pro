// App.jsx - Versión completa y corregida
import React, { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import LoginModal from './components/layout/LoginModal'
import { Toaster, toast } from "react-hot-toast";
import { usePremiumStore } from './stores/premiumStore' // 👈 IMPORTAR STORE

// Tus componentes existentes
import { TradingHeader } from './components/layout/TradingHeader'
import { QuotesCarousel } from './components/markets/QuotesCarousel'
import { LiveStreamsGrid } from './components/video/LiveStreamsGrid'

// Nuevos componentes premium
import PremiumGuard from './components/premium/PremiumGuard'
import { API_URL } from './config/runtime'
import ErrorBoundary from './components/common/ErrorBoundary'

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
  AlertCircle,
  Crown
} from 'lucide-react'

// Componente de gestión de usuarios (solo para admin)
const TradingViewCharts = lazy(() => import('./components/charts/TradingViewCharts').then((module) => ({ default: module.TradingViewCharts })))
const EconomicIndicators = lazy(() => import('./components/markets/EconomicIndicators').then((module) => ({ default: module.EconomicIndicators })))
const FinancialDashboard = lazy(() => import('./components/markets/FinancialDashboard').then((module) => ({ default: module.FinancialDashboard })))
const Notice = lazy(() => import('./components/charts/Notice').then((module) => ({ default: module.Notice })))
const TreemapDashboard = lazy(() => import('./components/charts/TreemapDashboard'))
const EconomicDataBlock = lazy(() => import('./components/markets/EconomicDataBlock'))
const AdSpace = lazy(() => import('./components/ads/AdSpace'))
const AnalisisPremiumPage = lazy(() => import('./pages/AnalisisPremiumPage'))
const UpgradePage = lazy(() => import('./pages/UpgradePage'))
const UserManagement = lazy(() => import('./components/admin/UserManagement'))

import './App.css'

const DeferredSection = ({ children, minHeight = 180 }) => {
  const sectionRef = useRef(null)
  const [isNearViewport, setIsNearViewport] = useState(false)

  useEffect(() => {
    const node = sectionRef.current
    if (!node || isNearViewport) return undefined

    if (!('IntersectionObserver' in window)) {
      setIsNearViewport(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true)
          observer.disconnect()
        }
      },
      { rootMargin: '400px 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [isNearViewport])

  return (
    <div ref={sectionRef} style={{ minHeight: isNearViewport ? undefined : minHeight }}>
      {isNearViewport ? (
        <Suspense fallback={<div className="text-center text-sm text-gray-500 py-8">Cargando módulo…</div>}>
          <ErrorBoundary>{children}</ErrorBoundary>
        </Suspense>
      ) : null}
    </div>
  )
}

// ============================================
// COMPONENTE PROTECTED ROUTE
// ============================================
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, isChecking } = useAuth()
  const location = useLocation()

  if (isChecking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400 font-mono">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    sessionStorage.setItem('redirectAfterLogin', location.pathname)
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center p-8 bg-gray-900/50 rounded-xl border border-red-800/30 font-mono">
          <div className="text-red-400 text-4xl mb-4">⛔</div>
          <h2 className="text-xl font-bold text-white mb-2">Acceso Restringido</h2>
          <p className="text-gray-400">No tienes permisos de administrador.</p>
        </div>
      </div>
    )
  }

  return children
}

// ============================================
// COMPONENTE MAIN LAYOUT
// ============================================
const MainLayout = ({ children, showHeader = true }) => {
  const { isAuthenticated, userRole, logout, getSessionTimeLeft } = useAuth()
  const [timeLeft, setTimeLeft] = useState(getSessionTimeLeft())

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getSessionTimeLeft())
    }, 30000)
    return () => clearInterval(interval)
  }, [getSessionTimeLeft])

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <FloatingEduButton />
      <MacroExplainer />

      {showHeader && (
        <>
          <div className="bg-gray-900/80 border-b border-gray-800">
            <div className="container mx-auto px-4 py-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${timeLeft > 300 ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                  </div>
                  <span className="text-gray-500">|</span>
                  <span className="text-gray-400">
                    <span className="text-blue-400">
                      {isAuthenticated ? userRole === 'admin' ? '👑 Admin' : '👤 Cliente' : 'No autenticado'}
                    </span>
                  </span>
                  
                  <div className="flex items-center space-x-4 ml-4">
                  <Link 
                    to="/dashboard" 
                    className="text-gray-300 hover:text-white transition px-3 py-1 rounded hover:bg-gray-800"
                  >
                    Dashboard
                  </Link>
                  
                  {/* Link a Premium (siempre visible) */}
                  <Link 
                    to={localStorage.getItem('esPremium') === 'true' ? "/analisis-premium" : "/upgrade"} 
                    className="text-yellow-400 hover:text-yellow-300 font-semibold flex items-center gap-1 transition px-3 py-1 rounded hover:bg-yellow-900/20"
                  >
                    <Crown className="w-4 h-4" />
                    Premium
                  </Link>
                </div>
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

      {children}
    </div>
  )
}

// ============================================
// PÁGINA DE LOGIN
// ============================================
const LoginPage = () => {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/dashboard'
    sessionStorage.removeItem('redirectAfterLogin')
    return <Navigate to={redirectTo} replace />
  }

  return (
    <div style={{ /* ... estilos existentes ... */ }}>
      <div style={{ /* ... */ }}>
        <LoginModal />
      </div>
    </div>
  )
}

// ============================================
// DASHBOARD PRINCIPAL
// ============================================
const DashboardPage = () => {
  const { isAdmin } = useAuth()
  const [showAdminPanel, setShowAdminPanel] = useState(false)

  const shouldShowAdminPanel = isAdmin && showAdminPanel

  return (
    <MainLayout>
      <div className="container mx-auto px-4">
        
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

        <div className="mb-8">
          <QuotesCarousel />
        </div>
        
        <div className="flex flex-col xl:flex-row gap-6">
          
          <div className="xl:w-[70%] min-w-0">
            <div className="space-y-6">
              <LiveStreamsGrid />
              <DeferredSection><EconomicIndicators /></DeferredSection>
              <DeferredSection><AdSpace /></DeferredSection>
              <DeferredSection minHeight={320}><FinancialDashboard /></DeferredSection>
            </div>
          </div>
          
          <div className="xl:w-[30%] min-w-0 space-y-6">
            <DeferredSection><Notice /></DeferredSection>
            <DeferredSection minHeight={320}><TreemapDashboard /></DeferredSection>
          </div>
        </div>
        
        <div className="w-full min-w-0 mt-6">
          <DeferredSection minHeight={320}><EconomicDataBlock /></DeferredSection>
        </div>
        
        <div className="w-full min-w-0 mt-6">
          <DeferredSection minHeight={500}><TradingViewCharts /></DeferredSection>
        </div>
      </div>
    </MainLayout>
  )
}

// ============================================
// PÁGINA 404
// ============================================
const NotFoundPage = () => (
  <MainLayout>
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center font-mono">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <p className="text-xl text-gray-400 mb-8">Página no encontrada</p>
        <Link 
          to="/dashboard" 
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Volver al Dashboard
        </Link>
      </div>
    </div>
  </MainLayout>
)

// ============================================
// COMPONENTE APP PRINCIPAL
// ============================================
function App() {
  const { alertas } = usePremiumStore();

useEffect(() => {
  
  const verificarAlertas = async () => {
    
    const nuevosPrecios = {};
    const alertasPorTipo = {
      bonos: alertas.filter((alerta) => alerta.tipo === 'bonos'),
      letras: alertas.filter((alerta) => alerta.tipo === 'letras'),
      empresas: alertas.filter((alerta) => alerta.tipo !== 'bonos' && alerta.tipo !== 'letras')
    };

    const cargarListado = async (tipo, lista) => {
      if (lista.length === 0) return;
      try {
        const res = await fetch(`${API_URL}/${tipo}`);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const instrumentos = await res.json();
        lista.forEach(({ ticker }) => {
          nuevosPrecios[ticker] = instrumentos.find((item) => item.symbol === ticker)?.last ?? null;
        });
      } catch (error) {
        console.error(`Error obteniendo ${tipo}`, error);
        lista.forEach(({ ticker }) => { nuevosPrecios[ticker] = null; });
      }
    };

    await Promise.all([
      cargarListado('bonos', alertasPorTipo.bonos),
      cargarListado('letras', alertasPorTipo.letras),
      ...alertasPorTipo.empresas.map(async ({ ticker }) => {
        try {
          const res = await fetch(`${API_URL}/company/${ticker}`);
          if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
          const data = await res.json();
          nuevosPrecios[ticker] = data.precio ?? null;
        } catch (error) {
          console.error('Error obteniendo precio para', ticker, error);
          nuevosPrecios[ticker] = null;
        }
      })
    ]);
    
    // Verificar cada alerta
    alertas.forEach(alerta => {
      
      if (!alerta.activa) {
        return;
      }
      
      const precioActual = nuevosPrecios[alerta.ticker];
      
      if (precioActual === null || precioActual === undefined) {
        return;
      }
      
      const condicionCumplida = alerta.condicion === 'mayor' 
        ? precioActual >= alerta.precioObjetivo
        : precioActual <= alerta.precioObjetivo;
            
      if (condicionCumplida) {
  toast.success(`🔔 ${alerta.ticker} alcanzó $${precioActual.toFixed(2)}`, {
    duration: 10000,
    icon: '🔔',
    style: {
      background: '#1F2937',
      color: '#fff',
      border: '1px solid #374151',
      fontSize: '16px'
    }
  });
}
    });
  };
  
  verificarAlertas();
  
  const intervalo = setInterval(verificarAlertas, 30000);
  
  return () => {
    clearInterval(intervalo);
  };
}, [alertas]); 

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1F2937',
            color: '#fff',
            border: '1px solid #374151'
          }
        }}
      />
      <Suspense fallback={<div className="min-h-[30vh] flex items-center justify-center text-gray-400">Cargando módulo…</div>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Navigate to="/dashboard" replace />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
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
        <Route path="/analisis-premium" element={
          <ProtectedRoute>
            <PremiumGuard>
              <MainLayout>
                <AnalisisPremiumPage />
              </MainLayout>
            </PremiumGuard>
          </ProtectedRoute>
        } />
        <Route path="/upgrade" element={
          <ProtectedRoute>
            <MainLayout>
              <UpgradePage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </Suspense>
    </>
  )
}

export default App
