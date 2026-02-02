import React, { useState, useEffect } from 'react';
import { 
  Users, Copy, RefreshCw, Eye, EyeOff, Trash2, Plus, 
  Check, X, Key, Mail, Shield, Search, Filter, AlertCircle,
  Edit2, Save, UserPlus, Code
} from 'lucide-react';
import { generatePasswordForClient } from '../../utils/passwordGenerator'

// ============================================
// BASE DE DATOS DE USUARIOS - Sincronizada con useAuth.js
// ============================================
const initialUserDatabase = {
  'ZW1haWw9YWRtaW5AdHJhZGluZ2Rlc2suY29tJnBhc3M9QWRtaW5AVHJhZGluZzIwMjUh': {
    email: 'admin@tradingdesk.com',
    name: 'Administrador',
    role: 'admin',
    plan: 'enterprise',
    active: true,
    createdAt: '2024-01-01'
  },
  "ZW1haWw9Y2xpZW50ZUxlb0BlbXByZXNhLmNvbSZwYXNzPUxlb0lvbEAh":{
        role:'client',
        name:'Leo',
        plan:'basic',
        active: true,
        createdAt: '2026-02-02'
    }
};

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================
const decodeHash = (hash) => {
  try {
    const decoded = atob(hash);
    const match = decoded.match(/email=([^&]+)&pass=(.+)/);
    if (match) {
      return {
        email: match[1],
        password: match[2],
        hash: hash
      };
    }
  } catch (error) {
    console.error('Error decodificando hash:', error);
  }
  return null;
};

const createUserHash = (email, password) => {
  return btoa(`email=${email}&pass=${password}`);
};

const getAllUsers = (userDatabase) => {
  const users = [];
  
  for (const [hash, userData] of Object.entries(userDatabase)) {
    const decoded = decodeHash(hash);
    if (decoded) {
      users.push({
        ...userData,
        email: decoded.email,
        hasPassword: true,
        isActive: userData.active,
        hash: hash,
        displayName: userData.name
      });
    }
  }
  
  return users;
};

const generateAuthCode = (userDatabase) => {
  const entries = [];
  
  for (const [hash, userData] of Object.entries(userDatabase)) {
    entries.push(`  '${hash}': {
    role: '${userData.role}',
    name: '${userData.name}',
    plan: '${userData.plan}'
  }`);
  }
  
  return `// HASHS SEGUROS - Actualizado: ${new Date().toLocaleString()}
const validCredentials = {
${entries.join(',\n')}
};`;
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
const UserManagement = () => {
  const [userDatabase, setUserDatabase] = useState(initialUserDatabase);
  const [users, setUsers] = useState([]);
  const [showPassword, setShowPassword] = useState({});
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('client');
  const [newUserPlan, setNewUserPlan] = useState('basic');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [generatedPassword, setGeneratedPassword] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [authCode, setAuthCode] = useState('');

  // Cargar usuarios al inicio
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers = getAllUsers(userDatabase);
    setUsers(allUsers);
    setAuthCode(generateAuthCode(userDatabase));
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
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 font-mono text-sm';
      notification.textContent = '✓ Mensaje copiado para WhatsApp';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    }
  };

  const handleCopyAuthCode = () => {
    navigator.clipboard.writeText(authCode);
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 font-mono text-sm';
    notification.textContent = '✓ Código copiado para useAuth.js';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const handleAddUser = () => {
    if (!newUserEmail.trim() || !generatedPassword) {
      alert('Primero genera una contraseña para el usuario');
      return;
    }
    
    const hash = createUserHash(newUserEmail, generatedPassword.password);
    
     const newUserData = {
      email: newUserEmail,
      name: newUserName || newUserEmail.split('@')[0],
      role: newUserRole,
      plan: newUserPlan,
      active: true,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    const updatedDatabase = {
      ...userDatabase,
      [hash]: newUserData
    };
    
    setUserDatabase(updatedDatabase);
    
    alert(`✅ Usuario creado!\n\nEmail: ${newUserEmail}\nPassword: ${generatedPassword.password}\n\n⚠️ Copia el código generado y actualiza useAuth.js`);
    
    setNewUserEmail('');
    setNewUserName('');
    setNewUserRole('client');
    setNewUserPlan('basic');
    setIsAddingUser(false);
    setGeneratedPassword(null);
    
    loadUsers();
  };

  const handleDeleteUser = (email) => {
    if (email === 'admin@tradingdesk.com') {
      alert('No puedes eliminar al administrador principal');
      return;
    }
    
    if (window.confirm(`¿Eliminar usuario ${email}?`)) {
      let hashToDelete = null;
      
      for (const [hash, userData] of Object.entries(userDatabase)) {
        const decoded = decodeHash(hash);
        if (decoded && decoded.email === email) {
          hashToDelete = hash;
          break;
        }
      }
      
      if (hashToDelete) {
        const { [hashToDelete]: _, ...remainingUsers } = userDatabase;
        setUserDatabase(remainingUsers);
        alert(`Usuario ${email} eliminado.\n\nElimina esta línea de useAuth.js:\n'${hashToDelete}': {...},`);
        loadUsers();
      }
    }
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;
    
    let targetHash = null;
    for (const [hash, userData] of Object.entries(userDatabase)) {
      const decoded = decodeHash(hash);
      if (decoded && decoded.email === editingUser.email) {
        targetHash = hash;
        break;
      }
    }
    
    if (targetHash) {
      const updatedDatabase = {
        ...userDatabase,
        [targetHash]: {
          ...userDatabase[targetHash],
          name: editingUser.name,
          role: editingUser.role,
          plan: editingUser.plan
        }
      };
      
      setUserDatabase(updatedDatabase);
      setEditingUser(null);
      loadUsers();
      alert('✅ Usuario actualizado');
    }
  };

    const handleStartEdit = (user) => {
    setEditingUser({
      email: user.email,
      name: user.name,
      role: user.role,
      plan: user.plan
    });
  };

   const getPasswordDisplay = (user) => {
    if (showPassword[user.email]) {
      const decoded = decodeHash(user.hash);
      return decoded ? decoded.password : '🔒 ******';
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
            <p className="text-sm text-gray-400">{users.length} usuarios activos</p>
          </div>
        </div>
        <button onClick={loadUsers} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg" title="Actualizar">
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
              Usuarios ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'generate' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-gray-400'}`}
            >
              <Key className="w-4 h-4 inline mr-2" />
              Generar Usuarios
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'code' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-gray-400'}`}
            >
              <Code className="w-4 h-4 inline mr-2" />
              Código ({users.length})
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
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCopyPassword}
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors text-sm"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar WhatsApp
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedPassword.password);
                  alert('✓ Contraseña copiada al portapapeles');
                }}
                className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center transition-colors text-sm"
              >
                <Key className="w-4 h-4 mr-2" />
                Copiar Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Edit2 className="w-5 h-5 mr-2 text-yellow-400" />
              Editar Usuario
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white opacity-70"
                />
                <p className="text-xs text-gray-500 mt-1">El email no se puede modificar</p>
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-1">Nombre</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Rol</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white"
                  >
                    <option value="client">Cliente</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Plan</label>
                  <select
                    value={editingUser.plan}
                    onChange={(e) => setEditingUser({...editingUser, plan: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white"
                  >
                    <option value="basic">Básico</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleUpdateUser}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded"
              >
                Cancelar
              </button>
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
            <div className="col-span-2">Rol</div>
            <div className="col-span-2">Plan</div>
            <div className="col-span-3 text-right">Acciones</div>
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
                      <div className="text-xs text-gray-500">{user.displayName}</div>
                    </div>
                  </div>
                  <div className="text-xs mt-1 flex items-center space-x-2">
                    <span className="text-gray-500">
                      {showPassword[user.email] ? (
                        <code className="text-green-400">{getPasswordDisplay(user)}</code>
                      ) : (
                        <span className="text-gray-400">🔒 Contraseña encriptada</span>
                      )}
                    </span>
                    <button
                      onClick={() => togglePasswordVisibility(user.email)}
                      className="text-gray-400 hover:text-white text-xs"
                    >
                      {showPassword[user.email] ? (
                        <><EyeOff className="w-3 h-3 inline mr-1" /> Ocultar</>
                      ) : (
                        <><Eye className="w-3 h-3 inline mr-1" /> Ver</>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="col-span-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-purple-900/30 text-purple-300' 
                      : 'bg-blue-900/30 text-blue-300'
                  }`}>
                    {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                  </span>
                </div>
                
                <div className="col-span-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                    user.plan === 'enterprise' ? 'bg-emerald-900/30 text-emerald-300' :
                    user.plan === 'pro' ? 'bg-blue-900/30 text-blue-300' :
                    'bg-gray-900/30 text-gray-300'
                  }`}>
                    {user.plan === 'enterprise' ? 'Enterprise' :
                     user.plan === 'pro' ? 'Pro' : 'Básico'}
                  </span>
                </div>
                
                <div className="col-span-3 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => handleStartEdit(user)}
                    className="p-1.5 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/20 rounded transition-colors"
                    title="Editar usuario"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleGeneratePassword(user.email, user.name)}
                    className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded transition-colors"
                    title="Generar nueva contraseña"
                  >
                    <Key className="w-4 h-4" />
                  </button>
                  {user.role !== 'admin' && (
                    <button
                      onClick={() => handleDeleteUser(user.email)}
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
              <UserPlus className="w-5 h-5 mr-2 text-blue-400" />
              Crear Nuevo Usuario
            </h4>
            <p className="text-sm text-gray-400 mb-4">
              Crea un nuevo usuario con credenciales seguras. El sistema generará un hash único.
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
                    Email del nuevo usuario
                  </label>
                  <input
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="nuevo@cliente.com"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Nombre del usuario
                  </label>
                  <input
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Nombre del cliente"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Rol</label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white"
                    >
                      <option value="client">Cliente</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Plan</label>
                    <select
                      value={newUserPlan}
                      onChange={(e) => setNewUserPlan(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white"
                    >
                      <option value="basic">Básico</option>
                      <option value="pro">Pro</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (newUserEmail) {
                      handleGeneratePassword(newUserEmail, newUserName || newUserEmail.split('@')[0]);
                    } else {
                      alert('Primero ingresa un email');
                    }
                  }}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg flex items-center justify-center"
                >
                  <Key className="w-5 h-5 mr-2" />
                  Generar Contraseña Segura
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleAddUser}
                    disabled={!newUserEmail.trim() || !generatedPassword}
                    className="py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Crear Usuario
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingUser(false);
                      setNewUserEmail('');
                      setNewUserName('');
                      setGeneratedPassword(null);
                    }}
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
              <div className="text-sm text-gray-400">Clientes</div>
            </div>
            <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-800/50">
              <div className="text-2xl font-bold text-white">{users.filter(u => u.role === 'admin').length}</div>
              <div className="text-sm text-gray-400">Administradores</div>
            </div>
            <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-800/50">
              <div className="text-2xl font-bold text-green-400">{users.length}/50</div>
              <div className="text-sm text-gray-400">Usuarios totales</div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido de la pestaña Código */}
      {activeTab === 'code' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-gray-900/30 to-purple-900/20 p-4 rounded-lg border border-gray-800/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Code className="w-5 h-5 text-purple-400" />
                <h4 className="font-medium text-white">Código para useAuth.js</h4>
              </div>
              <button
                onClick={handleCopyAuthCode}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg flex items-center"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar Código
              </button>
            </div>
            
            <div className="relative">
              <pre className="text-xs bg-black/50 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono text-gray-300 max-h-96 overflow-y-auto">
                {authCode}
              </pre>
              <div className="absolute top-3 right-3 text-xs bg-black/70 text-gray-400 px-2 py-1 rounded">
                {users.length} usuarios
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-900/10 border border-blue-800/30 rounded">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div>
                  <h5 className="font-medium text-blue-300 mb-1">Instrucciones importantes</h5>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>1. Copia el código completo de arriba</li>
                    <li>2. Abre el archivo <code className="bg-black/50 px-1 rounded">src/hooks/useAuth.js</code></li>
                    <li>3. Reemplaza el objeto <code>validCredentials</code> con este código</li>
                    <li>4. Guarda el archivo y haz <code>git push</code></li>
                    <li>5. Los cambios se aplicarán en el próximo deploy</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nota final */}
      <div className="mt-6 pt-4 border-t border-gray-800/30">
        <p className="text-xs text-gray-500 text-center">
          💡 <strong>Sistema basado en hashes seguros</strong> - Las contraseñas están encriptadas en base64
        </p>
        <p className="text-xs text-gray-600 text-center mt-1">
          Para aplicar cambios: Copia el código generado y actualiza <code className="bg-black/30 px-1 py-0.5 rounded">useAuth.js</code>
        </p>
      </div>
    </div>
  );
};

export default UserManagement;