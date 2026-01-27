/* loginModal.jsx - MODIFICADO PARA USAR BACKEND */

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, AlertCircle, Loader2, Smartphone, CheckCircle, Key } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const LoginModal = () => {
  const { isAuthenticated, login, loginWithCode, isChecking } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState('email'); // 'email' o 'code'
  const [accessCode, setAccessCode] = useState('');
  const [success, setSuccess] = useState('');

  // Efecto de entrada
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Si ya está autenticado o está verificando, no mostrar el modal
  if (isAuthenticated || isChecking) {
    return null;
  }

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
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
      if (result.success) {
        setSuccess('¡Autenticación exitosa! Redirigiendo...');
        // Cerrar modal o redirigir automáticamente después de un breve delay
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setError(result.message || 'Credenciales incorrectas');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Error de conexión con el servidor. Verifica que el backend esté corriendo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!accessCode.trim()) {
      setError('Por favor ingresa un código de acceso');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await loginWithCode(accessCode);
      if (result.success) {
        setSuccess('¡Acceso concedido! Redirigiendo...');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setError(result.message || 'Código inválido');
      }
    } catch (err) {
      console.error('Code login error:', err);
      setError('Error de conexión con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  // Credenciales de prueba (opcional, para desarrollo)
  const fillTestCredentials = () => {
    setEmail('admin@tradingdesk.com');
    setPassword('Admin@Trading2025!');
    setRememberMe(true);
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
                  {loginMode === 'email' ? 'ACCESO CON CREDENCIALES' : 'ACCESO CON CÓDIGO'}
                </p>
              </div>

              {/* Selector de modo de login */}
              <div className="flex justify-center mt-4">
                <div className="inline-flex rounded-lg p-1 bg-gray-800/50">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMode('email');
                      setError('');
                      setSuccess('');
                    }}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${loginMode === 'email' 
                      ? 'bg-blue-600 text-white shadow' 
                      : 'text-gray-400 hover:text-white'}`}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMode('code');
                      setError('');
                      setSuccess('');
                    }}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${loginMode === 'code' 
                      ? 'bg-green-600 text-white shadow' 
                      : 'text-gray-400 hover:text-white'}`}
                  >
                    Código
                  </button>
                </div>
              </div>
            </div>

            {/* Formulario según el modo */}
            <form onSubmit={loginMode === 'email' ? handleEmailLogin : handleCodeLogin} className="p-6 space-y-6">
              
              {/* Modo Email/Password */}
              {loginMode === 'email' && (
                <>
                  {/* Campo Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-center text-base font-semibold tracking-wide mb-3" style={{ color: '#d1d5db' }}>
                      EMAIL DE ACCESO
                    </label>
                    
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@tradingdesk.com"
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

                  {/* Campo Contraseña */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-center mb-3">
                      <label htmlFor="password" className="block text-center text-base font-semibold tracking-wide" style={{ color: '#d1d5db' }}>
                        CONTRASEÑA
                      </label>
                    </div>
                    
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Admin@Trading2025!"
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
                  <div className="flex items-center justify-center space-x-3 cursor-pointer group">
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
                      <span className="mr-2">💾</span>
                      RECORDAR SESIÓN
                    </label>
                  </div>
                </>
              )}

              {/* Modo Código de Acceso */}
              {loginMode === 'code' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full mb-4">
                      <Key className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-sm text-gray-400 mb-6">
                      Ingresa el código de acceso proporcionado por el administrador
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="accessCode" className="block text-center text-base font-semibold tracking-wide mb-3" style={{ color: '#d1d5db' }}>
                      CÓDIGO DE ACCESO
                    </label>
                    
                    <input
                      type="text"
                      id="accessCode"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                      placeholder="ADM-123456"
                      className="w-full px-5 py-4 text-base rounded-lg focus:outline-none transition-all text-center font-mono"
                      style={{
                        background: 'rgba(30, 41, 59, 0.5)',
                        border: '1px solid rgba(55, 65, 81, 0.5)',
                        color: '#f3f4f6',
                        caretColor: '#10b981',
                        minHeight: '56px',
                        fontSize: '18px',
                        letterSpacing: '2px',
                        textTransform: 'uppercase'
                      }}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <p className="text-sm text-gray-400 text-center">
                      El código se genera automáticamente para cada usuario en el backend
                    </p>
                  </div>
                </div>
              )}

              {/* Botón de ayuda para desarrollo */}
              {import.meta.env.DEV && loginMode === 'email' && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={fillTestCredentials}
                    className="text-sm text-blue-400 hover:text-blue-300 underline"
                  >
                    🔧 Usar credenciales de prueba (solo desarrollo)
                  </button>
                </div>
              )}

              {/* Mensajes de éxito */}
              {success && (
                <div className="p-4 rounded-lg" style={{
                  background: 'linear-gradient(90deg, rgba(5, 150, 105, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}>
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#34d399' }} />
                    <p className="text-sm text-center" style={{ color: '#34d399' }}>{success}</p>
                  </div>
                </div>
              )}

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
                disabled={isLoading || (loginMode === 'email' ? (!email || !password) : !accessCode)}
                className="w-full py-4 px-4 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group relative overflow-hidden"
                style={{
                  background: loginMode === 'email' 
                    ? 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)' 
                    : 'linear-gradient(135deg, #059669 0%, #3b82f6 100%)',
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
                    <span className="tracking-wide relative z-10">
                      {loginMode === 'email' ? 'VERIFICANDO CREDENCIALES...' : 'VERIFICANDO CÓDIGO...'}
                    </span>
                  </>
                ) : (
                  <span className="tracking-wide relative z-10">
                    {loginMode === 'email' ? 'ACCEDER AL DASHBOARD' : 'ACCEDER CON CÓDIGO'}
                  </span>
                )}
              </button>

            </form>

            {/* Footer informativo */}
            <div className="p-6 border-t text-center" style={{
              background: 'rgba(17, 24, 39, 0.5)',
              borderTopColor: 'rgba(55, 65, 81, 0.5)'
            }}>
              <p className="text-sm font-mono mb-2" style={{ color: '#6b7280' }}>
                ⚡ SISTEMA DE AUTENTICACIÓN SEGURO
              </p>
              <div className="flex items-center justify-center space-x-4 text-xs">
                <div className="flex items-center" style={{ color: '#10b981' }}>
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span>Backend conectado</span>
                </div>
                <span style={{ color: '#4b5563' }}>•</span>
                <span style={{ color: '#9ca3af' }}>JWT Tokens</span>
                <span style={{ color: '#4b5563' }}>•</span>
                <span style={{ color: '#9ca3af' }}>SQLite DB</span>
              </div>
              <p className="text-xs mt-3" style={{ color: '#4b5563' }}>
                Las credenciales son verificadas por el servidor de autenticación
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
      `}</style>
    </div>
  );
};

export default LoginModal;