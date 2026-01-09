/* usermanagement */
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Copy, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Trash2, 
  Plus, 
  Check, 
  X, 
  Key, 
  Mail, 
  Shield, 
  Search,
  Filter,
  AlertCircle
} from 'lucide-react';
import { extractUsersFromEnv } from '../../utils/authHelpers';
import { generatePasswordForClient } from '../../utils/passwordGenerator';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showPassword, setShowPassword] = useState({});
  const [newUserEmail, setNewUserEmail] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false); // ✅ CORREGIDO: Variable definida
  const [generatedPassword, setGeneratedPassword] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [ setSelectedUser] = useState(null); // ✅ CORREGIDO: Variable definida

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const extractedUsers = extractUsersFromEnv();
    setUsers(extractedUsers);
  };

  const handleGeneratePassword = (email, clientName = 'Nuevo Cliente') => {
    const passwordData = generatePasswordForClient(clientName);
    setGeneratedPassword({
      ...passwordData,
      forUser: email
    });
    setSelectedUser(email);
  };

  const handleCopyPassword = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword.message);
      
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 font-mono text-sm';
      notification.textContent = '✓ Mensaje copiado para WhatsApp';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    }
  };

  const handleAddUser = () => {
    if (!newUserEmail.trim()) return;
    
    const passwordData = generatePasswordForClient(newUserEmail);
    setGeneratedPassword({
      ...passwordData,
      forUser: newUserEmail
    });
    
    setNewUserEmail('');
    setIsAddingUser(false);
    loadUsers();
  };

  const getPasswordDisplay = (user) => {
    if (!user.hasPassword) return '❌ Sin contraseña';
    
    if (showPassword[user.email]) {
      for (let i = 1; i <= 10; i++) {
        const envVar = import.meta.env[`VITE_USER_${i}`];
        if (envVar && envVar.includes(user.email)) {
          const [_, password] = envVar.split(':');
          return password || '🔒 ******';
        }
      }
    }
    
    return '🔒 ******';
  };

  const togglePasswordVisibility = (email) => {
    setShowPassword(prev => ({
      ...prev,
      [email]: !prev[email]
    }));
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.displayName && user.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <Shield className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Gestión de Usuarios</h3>
            <p className="text-sm text-gray-400">Administra clientes y contraseñas</p>
          </div>
        </div>
        <button
          onClick={loadUsers}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          title="Actualizar lista"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs y Búsqueda */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          {/* Tabs */}
          <div className="flex border-b border-gray-800">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'users' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-gray-400'}`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Usuarios
            </button>
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'generate' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-gray-400'}`}
            >
              <Key className="w-4 h-4 inline mr-2" />
              Generar Claves
            </button>
          </div>

          {/* Búsqueda */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar usuario..."
              className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm w-full md:w-64"
            />
          </div>
        </div>
      </div>

      {/* Contraseña generada */}
      {generatedPassword && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/20 to-emerald-900/20 border border-blue-700/30 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs text-blue-300">Contraseña generada para:</div>
              <div className="font-medium text-white">{generatedPassword.forUser}</div>
            </div>
            <button
              onClick={() => setGeneratedPassword(null)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 bg-black/30 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Contraseña:</span>
                <code className="text-sm font-mono text-white bg-black/50 px-3 py-1 rounded">
                  {generatedPassword.password}
                </code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Fortaleza:</span>
                <span className={`text-sm font-medium ${
                  generatedPassword.strength < 60 ? 'text-red-400' :
                  generatedPassword.strength < 80 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {generatedPassword.strength}%
                </span>
              </div>
            </div>
            
            <button
              onClick={handleCopyPassword}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors text-sm"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copiar mensaje para WhatsApp
            </button>
            
            <div className="text-xs text-gray-400 text-center">
              📋 Envía este mensaje al cliente por WhatsApp
            </div>
          </div>
        </div>
      )}

      {/* Contenido de la pestaña Usuarios */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Encabezado de tabla */}
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-gray-400 bg-gray-800/30 rounded-lg">
            <div className="col-span-5">Usuario</div>
            <div className="col-span-3">Rol</div>
            <div className="col-span-2">Contraseña</div>
            <div className="col-span-2 text-right">Acciones</div>
          </div>

          {/* Lista de usuarios */}
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-800/20 hover:bg-gray-800/40 rounded-lg transition-colors items-center"
              >
                <div className="col-span-5">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="font-medium text-white">{user.email}</div>
                      <div className="text-xs text-gray-500">{user.displayName || 'Sin nombre'}</div>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-purple-900/30 text-purple-300' 
                      : 'bg-blue-900/30 text-blue-300'
                  }`}>
                    {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                  </span>
                </div>
                
                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm">
                      {getPasswordDisplay(user)}
                    </span>
                    {user.hasPassword && (
                      <button
                        onClick={() => togglePasswordVisibility(user.email)}
                        className="text-gray-400 hover:text-white"
                        title={showPassword[user.email] ? "Ocultar contraseña" : "Ver contraseña"}
                      >
                        {showPassword[user.email] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                  <div className="text-xs mt-1">
                    {user.isActive ? (
                      <span className="text-green-400 flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                        Activo
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-1" />
                        Sin contraseña
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="col-span-2 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => handleGeneratePassword(user.email, user.displayName)}
                    className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded transition-colors"
                    title="Generar nueva contraseña"
                  >
                    <Key className="w-4 h-4" />
                  </button>
                  {user.role !== 'admin' && (
                    <button
                      onClick={() => {
                        if (window.confirm(`¿Eliminar usuario ${user.email}?`)) {
                          loadUsers();
                        }
                      }}
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                      title="Eliminar usuario"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No se encontraron usuarios</p>
              <p className="text-sm mt-1">Intenta con otros términos de búsqueda</p>
            </div>
          )}

          {/* Resumen */}
          <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-800/50">
            <div>
              Mostrando <span className="text-white">{filteredUsers.length}</span> de <span className="text-white">{users.length}</span> usuarios
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Orden: Email (A-Z)</span>
            </div>
          </div>
        </div>
      )}

      {/* Contenido de la pestaña Generar */}
      {activeTab === 'generate' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-gray-900/30 to-blue-900/20 p-4 rounded-lg border border-gray-800/50">
            <h4 className="font-medium text-white mb-2 flex items-center">
              <Key className="w-5 h-5 mr-2 text-blue-400" />
              Generar Nuevas Credenciales
            </h4>
            <p className="text-sm text-gray-400 mb-4">
              Crea credenciales seguras para nuevos clientes. El sistema generará una contraseña automáticamente.
            </p>

            {!isAddingUser ? (
              <button
                onClick={() => setIsAddingUser(true)}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Agregar Nuevo Usuario
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Email del nuevo cliente
                  </label>
                  <input
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="nuevo@cliente.com"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleAddUser}
                    disabled={!newUserEmail.trim()}
                    className="py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Generar Credenciales
                  </button>
                  <button
                    onClick={() => setIsAddingUser(false)}
                    className="py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-800/50">
              <div className="text-2xl font-bold text-white">{users.filter(u => u.role === 'client').length}</div>
              <div className="text-sm text-gray-400">Clientes activos</div>
            </div>
            <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-800/50">
              <div className="text-2xl font-bold text-white">{users.filter(u => u.hasPassword).length}</div>
              <div className="text-sm text-gray-400">Con contraseña</div>
            </div>
            <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-800/50">
              <div className="text-2xl font-bold text-green-400">10</div>
              <div className="text-sm text-gray-400">Límite usuarios</div>
            </div>
          </div>

          {/* Instrucciones */}
          <div className="p-4 bg-gradient-to-r from-amber-900/10 to-amber-900/5 border border-amber-800/30 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-amber-300 mb-1">Instrucciones importantes</h5>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Las contraseñas generadas son de un solo uso</li>
                  <li>• Envía el mensaje de WhatsApp al cliente inmediatamente</li>
                  <li>• Para aplicar cambios permanentes, edita el archivo .env</li>
                  <li>• Nunca compartas credenciales por email no seguro</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nota final */}
      <div className="mt-6 pt-4 border-t border-gray-800/30">
        <p className="text-xs text-gray-500 text-center">
          💡 Para aplicar cambios permanentes, debes editar manualmente el archivo .env
        </p>
        <p className="text-xs text-gray-600 text-center mt-1">
          <code className="bg-black/30 px-2 py-1 rounded">VITE_USER_X=email:contraseña</code>
        </p>
      </div>
    </div>
  );
};

export default UserManagement;