import React, { useState, useEffect } from 'react';
import { Lock, User, Eye, EyeOff, AlertCircle, Loader2, Shield, Cpu, Server, Clock, Smartphone, Terminal, Key } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const LoginModal = () => {
  const { isAuthenticated, login, isChecking } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // === SEGURIDAD NIVEL 2: Admin con password extra ===
  const [adminAccessCode, setAdminAccessCode] = useState('');
  const [showAdminFeatures, setShowAdminFeatures] = useState(false);
  const [adminAttempts, setAdminAttempts] = useState(0);
  const [isAdminLocked, setIsAdminLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);
  
  // === CONFIGURACIÓN SEGURA ===
  // CAMBIA ESTA CONTRASEÑA POR UNA TUYA ÚNICA Y SEGURA
const ADMIN_SECRET_CODE = import.meta.env.VITE_ADMIN_SECRET_CODE || 'admin-fallback';
  const MAX_ADMIN_ATTEMPTS = 3;
  const ADMIN_LOCK_TIME = 300000; // 5 minutos en milisegundos
  
  // === SEGURIDAD NIVEL 3: Solo localhost ===
  const isLocalhost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
  
  // Timer para desbloqueo admin
  useEffect(() => {
    if (!isAdminLocked) return;
    
    const interval = setInterval(() => {
      const timeLeft = Math.max(0, lockTime - Date.now());
      if (timeLeft <= 0) {
        setIsAdminLocked(false);
        setAdminAttempts(0);
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isAdminLocked, lockTime]);

  const handleAdminAccess = () => {
    if (isAdminLocked) {
      const minutesLeft = Math.ceil((lockTime - Date.now()) / 60000);
      setError(`Modo admin bloqueado. Espera ${minutesLeft} minuto(s)`);
      return;
    }
    
    if (adminAccessCode === ADMIN_SECRET_CODE) {
      setShowAdminFeatures(true);
      setAdminAccessCode('');
      setError('');
      console.log('✅ Modo admin activado');
    } else {
      const newAttempts = adminAttempts + 1;
      setAdminAttempts(newAttempts);
      
      if (newAttempts >= MAX_ADMIN_ATTEMPTS) {
        setIsAdminLocked(true);
        setLockTime(Date.now() + ADMIN_LOCK_TIME);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim() || !password.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await login(email, password, rememberMe);
      
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Fondo con gradiente profesional */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-blue-950/90 to-gray-950" />
      
      {/* Patrón de grid sutil estilo terminal */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Modal centrado */}
      <div className="relative flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md">
          
          {/* === PANEL DE ACCESO ADMIN (SOLO LOCALHOST) === */}
          {isLocalhost && !showAdminFeatures && (
            <div className="mb-6 bg-gradient-to-r from-gray-900/80 to-blue-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-blue-300 font-mono">ACCESO ADMINISTRADOR</span>
                </div>
                <div className="text-xs px-2 py-1 bg-blue-900/30 text-blue-300 rounded">LOCAL</div>
              </div>
              
              <div className="space-y-3">
                <input
                  type="password"
                  value={adminAccessCode}
                  onChange={(e) => setAdminAccessCode(e.target.value)}
                  placeholder="Código de acceso admin"
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded text-white text-sm font-mono"
                  disabled={isAdminLocked}
                />
                
                <button
                  onClick={handleAdminAccess}
                  disabled={!adminAccessCode || isAdminLocked}
                  className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded text-sm font-medium disabled:opacity-50"
                >
                  {isAdminLocked ? 'BLOQUEADO' : 'ACTIVAR MODO ADMIN'}
                </button>
                
                {adminAttempts > 0 && (
                  <div className="text-xs text-gray-400 text-center">
                    Intentos: {adminAttempts}/{MAX_ADMIN_ATTEMPTS}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tarjeta de login principal */}
          <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-2xl shadow-2xl overflow-hidden">
            
            {/* Header con gradiente */}
            <div className="relative bg-gradient-to-r from-blue-900/40 via-blue-800/20 to-emerald-900/40 p-6 border-b border-gray-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
                    <div className="relative p-2 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl">
                      <Cpu className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">TRADING DESK PRO</h2>
                    <p className="text-xs text-gray-400 font-mono">
                      {showAdminFeatures ? 'MODO ADMINISTRADOR' : 'TERMINAL DE ACCESO'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1 bg-gray-800/50 rounded-full border border-gray-700/50">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-300 font-mono">ONLINE</span>
                </div>
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Campo Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-300">
                  <User className="w-4 h-4 mr-2" />
                  <span className="tracking-wide">EMAIL DE ACCESO</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-lg blur-sm group-hover:blur transition-all duration-300"></div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@empresa.com"
                    className="relative w-full px-4 py-3 pl-11 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-100 placeholder-gray-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    required
                    autoComplete="email"
                    disabled={isLoading}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <User className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Campo Contraseña */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="flex items-center text-sm font-medium text-gray-300">
                    <Lock className="w-4 h-4 mr-2" />
                    <span className="tracking-wide">CONTRASEÑA</span>
                  </label>
                  {showAdminFeatures && (
                    <div className="flex items-center text-xs text-blue-400">
                      <Key className="w-3 h-3 mr-1" />
                      ADMIN
                    </div>
                  )}
                </div>
                
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-lg blur-sm group-hover:blur transition-all duration-300"></div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-3 pl-11 pr-12 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-100 placeholder-gray-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                      required
                      disabled={isLoading}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Solo mostrar en modo admin */}
                {showAdminFeatures && (
                  <div className="pt-2">
                    <div className="text-xs text-gray-500 mb-1">CONTRASEÑA ADMIN:</div>
                    <div className="grid grid-cols-2 gap-1">
                      {['gonzalo@admin.com', 'Admin@Trading2025!'].map((item, idx) => (
                        <div key={idx} className="font-mono text-xs text-gray-400 bg-black/20 px-2 py-1 rounded">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Recordarme */}
              <div className="flex items-center space-x-3 cursor-pointer group">
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
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <label htmlFor="remember" className="text-sm text-gray-300 cursor-pointer">
                  Recordarme (30 días)
                </label>
              </div>

              {/* Mensaje de error */}
              {error && (
                <div className="p-3 bg-gradient-to-r from-red-900/20 to-red-800/10 border border-red-700/30 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-red-300">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Botón de inicio de sesión */}
              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    <span className="tracking-wide">VERIFICANDO...</span>
                  </>
                ) : (
                  <>
                    <div className="mr-2 group-hover:translate-x-1 transition-transform">
                      <Lock className="w-5 h-5" />
                    </div>
                    <span className="tracking-wide">ACCEDER AL DASHBOARD</span>
                  </>
                )}
              </button>

              {/* Información de seguridad */}
              <div className="pt-4 border-t border-gray-800/50">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <Shield className="w-5 h-5 text-green-400 mb-1" />
                    <span className="text-xs text-gray-400">Cifrado</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Server className="w-5 h-5 text-blue-400 mb-1" />
                    <span className="text-xs text-gray-400">Seguro</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Clock className="w-5 h-5 text-amber-400 mb-1" />
                    <span className="text-xs text-gray-400">60 min</span>
                  </div>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="bg-gray-900/50 border-t border-gray-800/50 p-4">
              <p className="text-xs text-gray-500 text-center font-mono">
                ⚠️ ACCESO EXCLUSIVO PARA CLIENTES AUTORIZADOS
              </p>
              <p className="text-xs text-gray-600 text-center mt-1">
                Las credenciales son personales e intransferibles
              </p>
            </div>
          </div>

          {/* Mensaje para móviles */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500 flex items-center justify-center">
              <Smartphone className="w-4 h-4 mr-2" />
              Usa las credenciales proporcionadas por el administrador
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;