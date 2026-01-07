import React, { useState, useEffect } from 'react';
import { Users, Copy, RefreshCw, Eye, EyeOff, Trash2, Plus, Check, X, Key, Mail, Shield, QrCode } from 'lucide-react';
import { extractUsersFromEnv} from '../../utils/authHelpers';
import { generatePasswordForClient } from '../../utils/passwordGenerator';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [showPassword, setShowPassword] = useState({});
  const [newUserEmail, setNewUserEmail] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState(null);
  const [activeTab, setActiveTab] = useState('users');

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
  };

  const handleCopyPassword = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword.message);
      
      // Notificación
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 font-mono text-sm';
      notification.textContent = '✓ Mensaje copiado para WhatsApp';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    }
  };

  const handleAddUser = () => {
    if (!newUserEmail.trim()) return;
    
    // Simular agregado (en producción sería editar .env)
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
      // Buscar en variables de entorno
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

  return (
    <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-4 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">Panel de Administración</h3>
            <p className="text-xs text-gray-400">Gestión de usuarios y acceso</p>
          </div>
        </div>
        <div className="text-xs px-2 py-1 bg-purple-900/30 text-purple-300 rounded">
          ADMIN
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 mb-4">
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

      {/* Contenido de la pestaña Usuarios */}
      {activeTab === 'users' && (
        <div className="space-y-3">
          {users.map((user, index) => (
            <div key={index} className="p-3 bg-gray-800/20 rounded-lg border border-gray-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-white">{user.email}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {user.role === 'admin' ? '👑 Administrador' : '👤 Cliente'}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleGeneratePassword(user.email, user.displayName)}
                    className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded"
                    title="Generar nueva contraseña"
                  >
                    <Key className="w-4 h-4" />
                  </button>
                  {user.role === 'client' && (
                    <button
                      onClick={() => togglePasswordVisibility(user.email)}
                      className="p-1.5 text-gray-400 hover:text-gray-300 hover:bg-gray-800/30 rounded"
                      title="Ver contraseña"
                    >
                      {showPassword[user.email] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
              
              {showPassword[user.email] && user.hasPassword && (
                <div className="mt-2 p-2 bg-black/30 rounded border border-gray-800">
                  <div className="font-mono text-sm text-center">
                    {getPasswordDisplay(user)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Contenido de la pestaña Generar */}
      {activeTab === 'generate' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Email del nuevo cliente</label>
            <input
              type="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              placeholder="nuevo@cliente.com"
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white text-sm"
            />
          </div>
          
          <button
            onClick={handleAddUser}
            className="w-full py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Generar Credenciales
          </button>
        </div>
      )}

      {/* Contraseña generada */}
      {generatedPassword && (
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-900/20 to-emerald-900/20 border border-blue-700/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-xs text-blue-300">Para:</div>
              <div className="font-medium text-white">{generatedPassword.forUser}</div>
            </div>
            <button
              onClick={() => setGeneratedPassword(null)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="p-2 bg-black/30 rounded">
              <div className="text-xs text-gray-400 mb-1">Contraseña:</div>
              <div className="font-mono text-sm text-center text-white tracking-wider">
                {generatedPassword.password}
              </div>
            </div>
            
            <button
              onClick={handleCopyPassword}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center text-sm"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copiar Mensaje WhatsApp
            </button>
          </div>
        </div>
      )}

      {/* Nota */}
      <div className="mt-4 pt-3 border-t border-gray-800/30">
        <p className="text-xs text-gray-500 text-center">
          Para aplicar cambios, edita manualmente el archivo .env
        </p>
      </div>
    </div>
  );
};

export default AdminPanel;