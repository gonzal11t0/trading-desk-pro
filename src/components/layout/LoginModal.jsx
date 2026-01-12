/* loginModal.jsx */

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, AlertCircle, Loader2, Terminal, Key, Smartphone } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const LoginModal = () => {
  const { isAuthenticated, login, isChecking } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [ setShowTooltip] = useState(false);
  
  // === SEGURIDAD NIVEL 2: Admin con password extra ===
  const [adminAccessCode, setAdminAccessCode] = useState('');
  const [showAdminFeatures, setShowAdminFeatures] = useState(false);
  const [adminAttempts, setAdminAttempts] = useState(0);
  const [isAdminLocked, setIsAdminLocked] = useState(false);
  
  // === CONFIGURACIÓN SEGURA ===
  const ADMIN_SECRET_CODE = import.meta.env.VITE_ADMIN_SECRET_CODE || 
                          (import.meta.env.DEV ? 'dev-secret-' + Date.now() : '');
  const MAX_ADMIN_ATTEMPTS = 3;
  const ADMIN_LOCK_TIME = 300000;
  
  // === SEGURIDAD NIVEL 3: Solo localhost ===
  const isLocalhost = import.meta.env.VITE_APP_ENV === 'development' || 
                   window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' ||
                   window.location.hostname.startsWith('192.168.');

  // Efecto de entrada
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Timer para desbloqueo admin
  useEffect(() => {
    if (!isAdminLocked) return;
    const timer = setTimeout(() => {
      setIsAdminLocked(false);
      setAdminAttempts(0);
    }, ADMIN_LOCK_TIME);
    return () => clearTimeout(timer);
  }, [isAdminLocked]);

  const handleAdminAccess = () => {
    if (isAdminLocked) {
      setError('Modo admin bloqueado. Espera 5 minutos.');
      return;
    }
    
    if (adminAccessCode === ADMIN_SECRET_CODE) {
      setShowAdminFeatures(true);
      setAdminAccessCode('');
      setError('');
    } else {
      const newAttempts = adminAttempts + 1;
      setAdminAttempts(newAttempts);
      
      if (newAttempts >= MAX_ADMIN_ATTEMPTS) {
        setIsAdminLocked(true);
        setError(`Demasiados intentos. Modo admin bloqueado por 5 minutos.`);
      } else {
        setError(`Código incorrecto. Intentos: ${newAttempts}/${MAX_ADMIN_ATTEMPTS}`);
      }
      setAdminAccessCode('');
    }
  };

  // Si ya está autenticado, no mostrar el modal
  if (isAuthenticated || isChecking) {
    return null;
  }

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim() || !password.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }
    
    if (!isValidEmail(email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await login(email, password, rememberMe);
      if (!result.success) setError(result.error);
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.');
      if (import.meta.env.DEV) console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ 
      animation: 'fadeIn 0.3s ease-out',
      WebkitAnimation: 'fadeIn 0.3s ease-out'
    }}>
      {/* Fondo con gradiente animado */}
      <div className="fixed inset-0" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        WebkitAnimation: 'gradientShift 15s ease infinite'
      }} />
      
      {/* Patrón de grid animado */}
      <div className="fixed inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '32px 32px',
        animation: 'gridPulse 3s ease-in-out infinite',
        WebkitAnimation: 'gridPulse 3s ease-in-out infinite'
      }} />

      {/* Modal centrado con animación */}
      <div className="relative flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-md sm:max-w-lg" style={{
          animation: 'slideUp 0.5s ease-out',
          WebkitAnimation: 'slideUp 0.5s ease-out'
        }}>
          
          {/* === PANEL DE ACCESO ADMIN (SOLO LOCALHOST) === */}
          {isLocalhost && !showAdminFeatures && (
            <div className="mb-6" style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(30, 64, 175, 0.5) 100%)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '16px',
              padding: '16px'
            }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4" style={{ color: '#93c5fd' }} />
                  <span className="text-sm font-mono" style={{ color: '#93c5fd' }}>ACCESO ADMINISTRADOR</span>
                </div>
                <div className="text-xs px-2 py-1 rounded" style={{ 
                  background: 'rgba(30, 64, 175, 0.3)',
                  color: '#93c5fd'
                }}>LOCAL</div>
              </div>
              
              <div className="space-y-3">
                <input
                  type="password"
                  value={adminAccessCode}
                  onChange={(e) => setAdminAccessCode(e.target.value)}
                  placeholder="Código de acceso admin"
                  className="w-full px-3 py-2 font-mono text-sm rounded"
                  style={{
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: '1px solid rgba(55, 65, 81, 0.5)',
                    color: 'white'
                  }}
                  disabled={isAdminLocked}
                />
                
                <button
                  onClick={handleAdminAccess}
                  disabled={!adminAccessCode || isAdminLocked}
                  className="w-full py-2 text-sm font-medium rounded disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    color: 'white'
                  }}
                >
                  {isAdminLocked ? 'BLOQUEADO' : 'ACTIVAR MODO ADMIN'}
                </button>
                
                {adminAttempts > 0 && (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="text-xs" style={{ color: '#9ca3af' }}>
                      Intentos: {adminAttempts}/{MAX_ADMIN_ATTEMPTS}
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(MAX_ADMIN_ATTEMPTS)].map((_, i) => (
                        <div 
                          key={i}
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: i < adminAttempts ? '#ef4444' : '#374151'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tarjeta de login principal */}
          <div className="relative rounded-2xl shadow-2xl overflow-hidden" style={{
            background: 'rgba(17, 24, 39, 0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(55, 65, 81, 0.5)'
          }}>
            
            {/* Header */}
            <div className="relative p-6 border-b" style={{
              background: 'linear-gradient(90deg, rgba(30, 64, 175, 0.4) 0%, rgba(30, 58, 138, 0.2) 50%, rgba(6, 78, 59, 0.4) 100%)',
              borderBottomColor: 'rgba(55, 65, 81, 0.5)',
            }}>
              <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight mb-2" style={{ color: 'white' }}>TRADING DESK PRO</h2>
                <p className="text-sm font-mono" style={{ color: '#9ca3af' }}>
                  {showAdminFeatures ? 'MODO ADMINISTRADOR' : 'ACCESO SEGURO'}
                </p>
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* Campo Email - MODIFICADO */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-center text-base font-semibold tracking-wide mb-3" style={{ color: '#d1d5db' }}>
                  EMAIL DE ACCESO
                </label>
                
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@empresa.com"
                  className="w-full px-5 py-4 text-base rounded-lg focus:outline-none transition-all text-center"
                  style={{
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: '1px solid rgba(55, 65, 81, 0.5)',
                    color: '#f3f4f6',
                    caretColor: '#3b82f6',
                    minHeight: '56px',
                    fontSize: '16px'
                  }}
                  required
                  autoComplete="email"
                  disabled={isLoading}
                />
                
                {email && !isValidEmail(email) && (
                  <div className="text-xs flex items-center justify-center mt-2" style={{ color: '#fbbf24' }}>
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Formato de email inválido
                  </div>
                )}
              </div>

              {/* Campo Contraseña - MODIFICADO */}
              <div className="space-y-2">
                <div className="flex items-center justify-center mb-3">
                  <label htmlFor="password" className="block text-center text-base font-semibold tracking-wide" style={{ color: '#d1d5db' }}>
                    CONTRASEÑA
                  </label>
                  {showAdminFeatures && (
                    <div className="ml-2 flex items-center text-xs" style={{ color: '#60a5fa' }}>
                      <Key className="w-3 h-3 mr-1" />
                      ADMIN
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-5 py-4 text-base rounded-lg focus:outline-none transition-all text-center"
                    style={{
                      background: 'rgba(30, 41, 59, 0.5)',
                      border: '1px solid rgba(55, 65, 81, 0.5)',
                      color: '#f3f4f6',
                      caretColor: '#3b82f6',
                      minHeight: '56px',
                      fontSize: '16px',
                      letterSpacing: '0.1em',
                      paddingRight: '60px'
                    }}
                    required
                    disabled={isLoading}
                  />
                  
                  {/* Botón para mostrar/ocultar contraseña */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors"
                    style={{ color: '#9ca3af' }}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                  </button>
                </div>

                {/* Indicador de fortaleza de contraseña */}
                {password && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm" style={{ color: '#9ca3af' }}>Seguridad:</span>
                      <span className="text-sm font-mono" style={{
                        color: password.length < 6 ? '#f87171' : 
                               password.length < 10 ? '#fbbf24' : '#34d399'
                      }}>
                        {password.length < 6 ? 'DÉBIL' : password.length < 10 ? 'MEDIA' : 'FUERTE'}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: '#1f2937' }}>
                      <div className="h-full transition-all duration-300" style={{
                        backgroundColor: password.length < 6 ? '#ef4444' : 
                                        password.length < 10 ? '#f59e0b' : '#10b981',
                        width: password.length < 6 ? '25%' : 
                               password.length < 10 ? '60%' : '100%'
                      }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Recordarme */}
              <div className="flex items-center justify-center space-x-3 cursor-pointer group relative"
                   onMouseEnter={() => setShowTooltip(true)}
                   onMouseLeave={() => setShowTooltip(false)}>
                <div className="relative">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${rememberMe ? 'bg-blue-500 border-blue-500' : 'bg-gray-800 border-gray-700 group-hover:border-gray-600'}`}>
                    {rememberMe && (
                      <svg className="w-4 h-4" style={{ color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )} 
                  </div>
                </div>
                <label htmlFor="remember" className="text-base font-bold tracking-wide cursor-pointer" style={{ 
                  color: rememberMe ? '#60a5fa' : '#d1d5db',
                  textShadow: rememberMe ? '0 0 10px rgba(96, 165, 250, 0.3)' : 'none'
                }}>
                  <span className="mr-2">💾</span> {/* Icono de disquete */}
                  RECORDAR SESIÓN
                </label>
              </div>

              {/* Mensaje de error */}
              {error && (
                <div className="p-4 rounded-lg" style={{
                  background: 'linear-gradient(90deg, rgba(127, 29, 29, 0.2) 0%, rgba(153, 27, 27, 0.1) 100%)',
                  border: '1px solid rgba(185, 28, 28, 0.3)',
                }}>
                  <div className="flex items-center justify-center space-x-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#fca5a5' }} />
                    <p className="text-sm text-center" style={{ color: '#fca5a5' }}>{error}</p>
                  </div>
                </div>
              )}

              {/* Botón de inicio de sesión */}
              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full py-4 px-4 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
                  color: 'white',
                  boxShadow: '0 10px 25px rgba(59, 130, 246, 0.2)',
                  minHeight: '60px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin relative z-10" />
                    <span className="tracking-wide relative z-10">VERIFICANDO CREDENCIALES...</span>
                  </>
                ) : (
                  <span className="tracking-wide relative z-10">ACCEDER AL DASHBOARD</span>
                )}
              </button>

            </form>

            {/* Footer */}
            <div className="p-6 border-t text-center" style={{
              background: 'rgba(17, 24, 39, 0.5)',
              borderTopColor: 'rgba(55, 65, 81, 0.5)'
            }}>
              <p className="text-sm font-mono mb-2" style={{ color: '#6b7280' }}>
                ⚠️ ACCESO EXCLUSIVO PARA CLIENTES AUTORIZADOS
              </p>
              <p className="text-xs" style={{ color: '#4b5563' }}>
                Las credenciales son personales e intransferibles
              </p>
              <p className="text-xs mt-2 flex items-center justify-center" style={{ color: '#6b7280' }}>
                <Smartphone className="w-4 h-4 mr-2" />
                Usa las credenciales proporcionadas por el administrador
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos inline para animaciones */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes gridPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default LoginModal;