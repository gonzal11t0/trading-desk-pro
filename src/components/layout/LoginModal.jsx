/*loginModal.jsx - VERSIÓN MEJORADA CON UX/UI*/

import React, { useState, useEffect } from 'react';
import { Lock, User, Eye, EyeOff, AlertCircle, Loader2, Shield, Cpu, Server, Clock, Smartphone, Terminal, Key, Zap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const LoginModal = () => {
  const { isAuthenticated, login, isChecking } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
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
            
            {/* Header con gradiente animado */}
            <div className="relative p-6 border-b" style={{
              background: 'linear-gradient(90deg, rgba(30, 64, 175, 0.4) 0%, rgba(30, 58, 138, 0.2) 50%, rgba(6, 78, 59, 0.4) 100%)',
              borderBottomColor: 'rgba(55, 65, 81, 0.5)',
              animation: 'gradientFlow 3s ease-in-out infinite',
              WebkitAnimation: 'gradientFlow 3s ease-in-out infinite',
              backgroundSize: '200% 100%'
            }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full" style={{
                      background: 'rgba(59, 130, 246, 0.2)',
                      filter: 'blur(12px)'
                    }}></div>
                    <div className="relative p-2 rounded-xl" style={{
                      background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)'
                    }}>
                      <Cpu className="w-7 h-7" style={{ color: 'white' }} />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight" style={{ color: 'white' }}>TRADING DESK PRO</h2>
                    <p className="text-xs font-mono" style={{ color: '#9ca3af' }}>
                      {showAdminFeatures ? 'MODO ADMINISTRADOR' : 'TERMINAL DE ACCESO'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1 rounded-full border" style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  borderColor: 'rgba(55, 65, 81, 0.5)'
                }}>
                  <div className="w-2 h-2 rounded-full" style={{
                    backgroundColor: '#10b981',
                    animation: 'pulse 2s infinite',
                    WebkitAnimation: 'pulse 2s infinite'
                  }}></div>
                  <span className="text-xs font-mono" style={{ color: '#d1d5db' }}>ONLINE</span>
                </div>
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Campo Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="flex items-center text-sm font-medium" style={{ color: '#d1d5db' }}>
                  <User className="w-4 h-4 mr-2" />
                  <span className="tracking-wide">EMAIL DE ACCESO</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 rounded-lg blur-sm group-hover:blur transition-all duration-300" style={{
                    background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)'
                  }}></div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@empresa.com"
                    className="relative w-full px-4 py-3 pl-11 font-mono text-sm rounded-lg focus:outline-none transition-all"
                    style={{
                      background: 'rgba(30, 41, 59, 0.5)',
                      border: '1px solid rgba(55, 65, 81, 0.5)',
                      color: '#f3f4f6',
                      caretColor: '#3b82f6'
                    }}
                    required
                    autoComplete="email"
                    disabled={isLoading}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#9ca3af' }}>
                    <User className="w-5 h-5" />
                  </div>
                </div>
                {email && !isValidEmail(email) && (
                  <div className="text-xs flex items-center mt-1" style={{ color: '#fbbf24' }}>
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Formato de email inválido
                  </div>
                )}
              </div>

              {/* Campo Contraseña */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="flex items-center text-sm font-medium" style={{ color: '#d1d5db' }}>
                    <Lock className="w-4 h-4 mr-2" />
                    <span className="tracking-wide">CONTRASEÑA</span>
                  </label>
                  {showAdminFeatures && (
                    <div className="flex items-center text-xs" style={{ color: '#60a5fa' }}>
                      <Key className="w-3 h-3 mr-1" />
                      ADMIN
                    </div>
                  )}
                </div>
                
                <div className="relative group">
                  <div className="absolute inset-0 rounded-lg blur-sm group-hover:blur transition-all duration-300" style={{
                    background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)'
                  }}></div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-3 pl-11 pr-12 font-mono text-sm rounded-lg focus:outline-none transition-all"
                      style={{
                        background: 'rgba(30, 41, 59, 0.5)',
                        border: '1px solid rgba(55, 65, 81, 0.5)',
                        color: '#f3f4f6',
                        caretColor: '#3b82f6'
                      }}
                      required
                      disabled={isLoading}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#9ca3af' }}>
                      <Lock className="w-5 h-5" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors"
                      style={{ color: '#9ca3af' }}
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Indicador de fortaleza de contraseña */}
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ color: '#9ca3af' }}>Seguridad:</span>
                      <span className="text-xs font-mono" style={{
                        color: password.length < 6 ? '#f87171' : 
                               password.length < 10 ? '#fbbf24' : '#34d399'
                      }}>
                        {password.length < 6 ? 'DÉBIL' : password.length < 10 ? 'MEDIA' : 'FUERTE'}
                      </span>
                    </div>
                    <div className="h-1 w-full rounded-full overflow-hidden" style={{ backgroundColor: '#1f2937' }}>
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

              {/* Recordarme con tooltip */}
              <div className="flex items-center space-x-3 cursor-pointer group relative"
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
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${rememberMe ? 'bg-blue-500 border-blue-500' : 'bg-gray-800 border-gray-700 group-hover:border-gray-600'}`}>
                    {rememberMe && (
                      <svg className="w-3 h-3" style={{ color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <label htmlFor="remember" className="text-sm cursor-pointer" style={{ color: '#d1d5db' }}>
                  Recordarme (30 días)
                  {showTooltip && (
                    <span className="absolute -top-8 left-0 text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity pointer-events-none" style={{
                      background: 'rgba(17, 24, 39, 0.9)',
                      color: '#9ca3af',
                      border: '1px solid rgba(55, 65, 81, 0.5)',
                      opacity: 1
                    }}>
                      Almacena tu sesión por 30 días
                    </span>
                  )}
                </label>
              </div>


              {/* Mensaje de error con animación */}
              {error && (
                <div className="p-3 rounded-lg" style={{
                  background: 'linear-gradient(90deg, rgba(127, 29, 29, 0.2) 0%, rgba(153, 27, 27, 0.1) 100%)',
                  border: '1px solid rgba(185, 28, 28, 0.3)',
                  animation: error.includes('incorrecto') || error.includes('Error') ? 'shake 0.5s ease-in-out' : 'none',
                  WebkitAnimation: error.includes('incorrecto') || error.includes('Error') ? 'shake 0.5s ease-in-out' : 'none'
                }}>
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#fca5a5' }} />
                    <div>
                      <p className="text-sm" style={{ color: '#fca5a5' }}>{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Botón de inicio de sesión con efecto shimmer */}
              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full py-3 px-4 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
                  color: 'white',
                  boxShadow: '0 10px 25px rgba(59, 130, 246, 0.2)'
                }}
              >
                {isLoading && (
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                    animation: 'shimmer 2s infinite',
                    WebkitAnimation: 'shimmer 2s infinite'
                  }} />
                )}
                
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin relative z-10" />
                    <span className="tracking-wide relative z-10">VERIFICANDO...</span>
                  </>
                ) : (
                  <>
                    <div className="mr-2 transition-transform relative z-10" style={{
                      transform: 'group-hover:translateX(4px)'
                    }}>
                      <Lock className="w-5 h-5" />
                    </div>
                    <span className="tracking-wide relative z-10">ACCEDER AL DASHBOARD</span>
                  </>
                )}
              </button>

            </form>

            {/* Footer */}
            <div className="p-4 border-t" style={{
              background: 'rgba(17, 24, 39, 0.5)',
              borderTopColor: 'rgba(55, 65, 81, 0.5)'
            }}>
              <p className="text-xs text-center font-mono" style={{ color: '#6b7280' }}>
                ⚠️ ACCESO EXCLUSIVO PARA CLIENTES AUTORIZADOS
              </p>
              <p className="text-xs text-center mt-1" style={{ color: '#4b5563' }}>
                Las credenciales son personales e intransferibles
              </p>
            </div>
          </div>

          {/* Mensaje para móviles */}
          <div className="mt-4 text-center">
            <p className="text-sm flex items-center justify-center" style={{ color: '#6b7280' }}>
              <Smartphone className="w-4 h-4 mr-2" />
              Usa las credenciales proporcionadas por el administrador
            </p>
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
        
        @keyframes gradientFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default LoginModal;