import React, { useState, useEffect, useCallback } from 'react';
import { Users, Copy, RefreshCw, Eye, EyeOff, Trash2, Plus, Check, X, Key, Mail, Shield, QrCode, AlertCircle } from 'lucide-react';
import { extractUsersFromEnv } from '../../utils/authHelpers';
import { generatePasswordForClient } from '../../utils/passwordGenerator';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [showPassword, setShowPassword] = useState({});
  const [newUserEmail, setNewUserEmail] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(false);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);

  // Cargar usuarios
  useEffect(() => {
    loadUsers();
  }, []);

  // Cerrar contraseñas visibles después de 30 segundos
  useEffect(() => {
    if (Object.keys(showPassword).length > 0) {
      const timer = setTimeout(() => {
        setShowPassword({});
      }, 30000); // 30 segundos
      return () => clearTimeout(timer);
    }
  }, [showPassword]);

  const loadUsers = () => {
    try {
      const extractedUsers = extractUsersFromEnv();
      setUsers(extractedUsers);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error loading users:', error);
      }
    }
  };

  const togglePasswordVisibility = useCallback((email) => {
    setShowPassword(prev => ({
      ...prev,
      [email]: !prev[email]
    }));
  }, []);

  const handleGeneratePassword = useCallback((email, clientName = 'Nuevo Cliente') => {
    try {
      const passwordData = generatePasswordForClient(clientName);
      setGeneratedPassword({
        ...passwordData,
        forUser: email,
        timestamp: Date.now()
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error generating password:', error);
      }
    }
  }, []);

  const handleCopyPassword = useCallback(() => {
    if (generatedPassword?.message) {
      navigator.clipboard.writeText(generatedPassword.message)
        .then(() => {
          setShowCopyFeedback(true);
          setTimeout(() => setShowCopyFeedback(false), 2000);
        })
        .catch(err => {
          if (import.meta.env.DEV) {
            console.error('Failed to copy:', err);
          }
        });
    }
  }, [generatedPassword]);

  const handleAddUser = useCallback(() => {
    const trimmedEmail = newUserEmail.trim();
    
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return;
    }
    
    // Verificar si el usuario ya existe
    if (users.some(user => user.email === trimmedEmail)) {
      return;
    }
    
    try {
      const passwordData = generatePasswordForClient(trimmedEmail);
      setGeneratedPassword({
        ...passwordData,
        forUser: trimmedEmail,
        timestamp: Date.now()
      });
      
      setNewUserEmail('');
      setIsAddingUser(false);
      
      // Agregar a la lista local
      setUsers(prev => [...prev, {
        email: trimmedEmail,
        role: 'client',
        hasPassword: true,
        displayName: trimmedEmail.split('@')[0]
      }]);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error adding user:', error);
      }
    }
  }, [newUserEmail, users]);

  const getPasswordDisplay = useCallback((user) => {
    if (!user.hasPassword) {
      return (
        <span style={{ color: '#ef4444', fontStyle: 'italic' }}>
          ❌ Sin contraseña configurada
        </span>
      );
    }
    
    if (showPassword[user.email]) {
      // Ocultar después de mostrar (seguridad)
      setTimeout(() => {
        if (showPassword[user.email]) {
          setShowPassword(prev => ({ ...prev, [user.email]: false }));
        }
      }, 10000); // Auto-ocultar después de 10 segundos
      
      // Solo buscar en desarrollo
      if (import.meta.env.DEV) {
        for (let i = 1; i <= 10; i++) {
          const envVar = import.meta.env[`VITE_USER_${i}`];
          if (envVar && envVar.includes(user.email)) {
            const [, password] = envVar.split(':');
            return password ? (
              <span style={{ 
                color: '#10b981',
                letterSpacing: '1px',
                fontWeight: '600',
                fontFamily: 'monospace'
              }}>
                {password}
              </span>
            ) : '🔒 ******';
          }
        }
      }
      
      return (
        <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>
          🔒 La contraseña no está disponible en este entorno
        </span>
      );
    }
    
    return '🔒 ******';
  }, [showPassword]);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    loadUsers();
    setTimeout(() => setLoading(false), 500);
  }, []);

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            padding: '8px',
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.3) 0%, rgba(16, 185, 129, 0.3) 100%)',
            borderRadius: '8px'
          }}>
            <Shield style={{ width: '20px', height: '20px', color: '#60a5fa' }} />
          </div>
          <div>
            <h3 style={{
              margin: 0,
              fontWeight: '700',
              color: 'white',
              fontSize: '18px'
            }}>
              Panel de Administración
            </h3>
            <p style={{
              margin: 0,
              fontSize: '12px',
              color: '#9ca3af'
            }}>
              Gestión segura de usuarios y acceso
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleRefresh}
            disabled={loading}
            style={{
              padding: '6px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '6px',
              color: loading ? '#6b7280' : '#60a5fa',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Actualizar lista de usuarios"
          >
            <RefreshCw style={{
              width: '16px',
              height: '16px',
              animation: loading ? 'spin 1s linear infinite' : 'none'
            }} />
          </button>
          
          <div style={{
            padding: '4px 8px',
            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: '600',
            color: '#c4b5fd',
            letterSpacing: '0.5px'
          }}>
            ADMIN
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid rgba(55, 65, 81, 0.5)',
        marginBottom: '20px'
      }}>
        {[
          { id: 'users', label: 'Usuarios', icon: Users },
          { id: 'generate', label: 'Generar Claves', icon: Key }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              color: activeTab === tab.id ? '#60a5fa' : '#9ca3af',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <tab.icon style={{ width: '16px', height: '16px' }} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido de la pestaña Usuarios */}
      {activeTab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {users.length === 0 ? (
            <div style={{
              padding: '24px',
              textAlign: 'center',
              background: 'rgba(30, 41, 59, 0.3)',
              borderRadius: '8px',
              border: '1px dashed rgba(55, 65, 81, 0.5)'
            }}>
              <Users style={{ width: '32px', height: '32px', color: '#6b7280', marginBottom: '12px' }} />
              <p style={{ margin: 0, color: '#9ca3af', fontSize: '14px' }}>
                No hay usuarios configurados
              </p>
            </div>
          ) : (
            users.map((user, index) => (
              <div
                key={`${user.email}-${index}`}
                style={{
                  padding: '16px',
                  background: 'rgba(30, 41, 59, 0.5)',
                  borderRadius: '8px',
                  border: '1px solid rgba(55, 65, 81, 0.5)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: showPassword[user.email] ? '12px' : '0'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <Mail style={{ width: '16px', height: '16px', color: '#9ca3af' }} />
                      <span style={{
                        fontWeight: '600',
                        color: 'white',
                        fontSize: '14px',
                        wordBreak: 'break-all'
                      }}>
                        {user.email}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: user.role === 'admin' ? '#fbbf24' : '#34d399',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {user.role === 'admin' ? '👑 Administrador' : '👤 Cliente'}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      onClick={() => handleGeneratePassword(user.email, user.displayName)}
                      style={{
                        padding: '6px',
                        background: 'rgba(37, 99, 235, 0.1)',
                        border: '1px solid rgba(37, 99, 235, 0.2)',
                        borderRadius: '6px',
                        color: '#60a5fa',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      title="Generar nueva contraseña"
                    >
                      <Key style={{ width: '16px', height: '16px' }} />
                    </button>
                    
                    {user.role === 'client' && (
                      <button
                        onClick={() => togglePasswordVisibility(user.email)}
                        style={{
                          padding: '6px',
                          background: showPassword[user.email] 
                            ? 'rgba(239, 68, 68, 0.1)' 
                            : 'rgba(55, 65, 81, 0.3)',
                          border: showPassword[user.email]
                            ? '1px solid rgba(239, 68, 68, 0.3)'
                            : '1px solid rgba(55, 65, 81, 0.5)',
                          borderRadius: '6px',
                          color: showPassword[user.email] ? '#f87171' : '#9ca3af',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        title={showPassword[user.email] ? "Ocultar contraseña" : "Ver contraseña"}
                      >
                        {showPassword[user.email] ? (
                          <EyeOff style={{ width: '16px', height: '16px' }} />
                        ) : (
                          <Eye style={{ width: '16px', height: '16px' }} />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                
                {showPassword[user.email] && user.hasPassword && (
                  <div style={{
                    marginTop: '12px',
                    padding: '12px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '6px',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    animation: 'fadeIn 0.3s ease-out'
                  }}>
                    <div style={{
                      fontSize: '12px',
                      color: '#9ca3af',
                      marginBottom: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <AlertCircle style={{ width: '12px', height: '12px' }} />
                      Visible por 10 segundos
                    </div>
                    <div style={{
                      fontFamily: '"SF Mono", Monaco, Consolas, monospace',
                      fontSize: '14px',
                      textAlign: 'center',
                      padding: '8px',
                      letterSpacing: '2px'
                    }}>
                      {getPasswordDisplay(user)}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Contenido de la pestaña Generar */}
      {activeTab === 'generate' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              color: '#d1d5db',
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              Email del nuevo cliente
            </label>
            <input
              type="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              placeholder="nuevo@cliente.com"
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(55, 65, 81, 0.5)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(55, 65, 81, 0.5)';
                e.target.style.boxShadow = 'none';
              }}
            />
            {newUserEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUserEmail) && (
              <div style={{
                marginTop: '4px',
                fontSize: '12px',
                color: '#f87171',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <AlertCircle style={{ width: '12px', height: '12px' }} />
                Formato de email inválido
              </div>
            )}
          </div>
          
          <button
            onClick={handleAddUser}
            disabled={!newUserEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUserEmail)}
            style={{
              width: '100%',
              padding: '12px',
              background: !newUserEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUserEmail)
                ? 'linear-gradient(135deg, rgba(55, 65, 81, 0.5) 0%, rgba(75, 85, 99, 0.5) 100%)'
                : 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
              color: 'white',
              borderRadius: '8px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: !newUserEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUserEmail)
                ? 'not-allowed'
                : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              opacity: !newUserEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUserEmail) ? 0.5 : 1
            }}
          >
            <Plus style={{ width: '16px', height: '16px' }} />
            Generar Credenciales
          </button>
        </div>
      )}

      {/* Contraseña generada */}
      {generatedPassword && (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '12px',
          animation: 'slideDown 0.3s ease-out'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <div>
              <div style={{ fontSize: '12px', color: '#93c5fd', marginBottom: '2px' }}>
                Credenciales generadas para:
              </div>
              <div style={{
                fontWeight: '600',
                color: 'white',
                fontSize: '14px',
                wordBreak: 'break-all'
              }}>
                {generatedPassword.forUser}
              </div>
            </div>
            <button
              onClick={() => setGeneratedPassword(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              padding: '12px',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '8px',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
              <div style={{
                fontSize: '12px',
                color: '#93c5fd',
                marginBottom: '8px',
                textAlign: 'center'
              }}>
                Contraseña segura generada
              </div>
              <div style={{
                fontFamily: '"SF Mono", Monaco, Consolas, monospace',
                fontSize: '16px',
                textAlign: 'center',
                color: '#10b981',
                letterSpacing: '3px',
                padding: '12px',
                background: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '6px',
                fontWeight: '600'
              }}>
                {generatedPassword.password}
              </div>
            </div>
            
            <button
              onClick={handleCopyPassword}
              style={{
                width: '100%',
                padding: '12px',
                background: showCopyFeedback 
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              {showCopyFeedback ? (
                <>
                  <Check style={{ width: '16px', height: '16px' }} />
                  ¡Copiado al portapapeles!
                </>
              ) : (
                <>
                  <Copy style={{ width: '16px', height: '16px' }} />
                  Copiar Mensaje para WhatsApp
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Nota de seguridad */}
      <div style={{
        marginTop: '20px',
        paddingTop: '16px',
        borderTop: '1px solid rgba(55, 65, 81, 0.3)'
      }}>
        <div style={{
          fontSize: '11px',
          color: '#6b7280',
          textAlign: 'center',
          lineHeight: '1.5'
        }}>
          ⚠️ Las credenciales solo se muestran temporalmente. 
          Para cambios permanentes, edita manualmente el archivo .env
        </div>
      </div>

      {/* Feedback de copiado */}
      {showCopyFeedback && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
          zIndex: 9999,
          animation: 'slideInRight 0.3s ease-out, fadeOut 0.3s ease-out 1.7s forwards'
        }}>
          <Check style={{ width: '16px', height: '16px' }} />
          Mensaje copiado para WhatsApp
        </div>
      )}

      {/* Estilos inline para animaciones */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(100%); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;