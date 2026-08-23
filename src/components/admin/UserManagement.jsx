import React, { useState, useEffect, useCallback } from 'react';
import { Users, RefreshCw, Trash2, Plus, Check, X, Mail, Shield, Search, UserPlus, Server } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { API_URL } from '../../config/runtime';

const UserManagement = () => {
const { isAdmin, currentUser } = useAuth();
const [generatedPassword, setGeneratedPassword] = useState(null);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('client');
  const [newUserPlan, setNewUserPlan] = useState('basic');
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState(null);

  const getToken = () => localStorage.getItem('tdp_token');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) loadUsers();
  }, [isAdmin, loadUsers]);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCreateUser = async () => {
  if (!newUserEmail.trim() || !newUserPassword.trim()) {
    showMessage('Email y contraseña son requeridos', 'error');
    return;
  }
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/admin/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: newUserEmail,
        password: newUserPassword,
        name: newUserName || newUserEmail.split('@')[0],
        role: newUserRole,
        plan: newUserPlan
      })
    });
    const data = await response.json();
    if (response.ok) {
      // Guardar la contraseña para mostrarla
      setGeneratedPassword({
        email: newUserEmail,
        password: newUserPassword
      });
      
      showMessage(`✅ Usuario ${newUserEmail} creado`, 'success');
      setNewUserEmail('');
      setNewUserName('');
      setNewUserPassword('');
      loadUsers();
    } else {
      showMessage(data.error || 'Error creando usuario', 'error');
    }
  } catch {
    showMessage('Error de conexión', 'error');
  }
};

  const handleDeleteUser = async (userId, userEmail) => {
    if (userEmail === currentUser?.email) {
      showMessage('No puedes eliminarte a ti mismo', 'error');
      return;
    }
    if (!window.confirm(`¿Eliminar usuario ${userEmail}?`)) return;
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        showMessage(`✅ Usuario ${userEmail} eliminado`);
        loadUsers();
      } else {
        const data = await response.json();
        showMessage(data.error || 'Error eliminando usuario', 'error');
      }
    } catch {
      showMessage('Error de conexión', 'error');
    }
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewUserPassword(password);
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!isAdmin) {
    return (
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
        <Shield className="w-16 h-16 text-red-500 mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-bold text-white mb-2">Acceso Denegado</h3>
        <p className="text-gray-400">No tienes permisos para acceder a esta sección</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
      {message && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
          message.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white text-sm flex items-center gap-2`}>
          {message.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          {message.text}
        </div>
      )}

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
        <button onClick={loadUsers} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex border-b border-gray-800">
            <button onClick={() => setActiveTab('users')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'users' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-gray-400'}`}>
              <Users className="w-4 h-4 inline mr-2" /> Usuarios ({users.length})
            </button>
            <button onClick={() => setActiveTab('create')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'create' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-gray-400'}`}>
              <UserPlus className="w-4 h-4 inline mr-2" /> Crear Usuario
            </button>
          </div>
          <div className="relative">
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar usuario..." className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm w-full md:w-64" />
          </div>
        </div>
      </div>

      {activeTab === 'users' && (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Cargando...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No se encontraron usuarios</div>
          ) : (
            <>
              <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-gray-400 bg-gray-800/30 rounded-lg">
                <div className="col-span-5">Usuario</div>
                <div className="col-span-2">Rol</div>
                <div className="col-span-2">Plan</div>
                <div className="col-span-3 text-right">Acciones</div>
              </div>
              {filteredUsers.map((user) => (
                <div key={user.id} className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-800/20 hover:bg-gray-800/40 rounded-lg items-center">
                  <div className="col-span-5">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="font-medium text-white">{user.email}</div>
                        <div className="text-xs text-gray-500">{user.name}</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-900/30 text-purple-300' : 'bg-blue-900/30 text-blue-300'}`}>
                      {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className={`inline-flex px-2.5 py-0.5 rounded text-xs font-medium ${user.plan === 'enterprise' ? 'bg-emerald-900/30 text-emerald-300' : user.plan === 'pro' ? 'bg-blue-900/30 text-blue-300' : 'bg-gray-900/30 text-gray-300'}`}>
                      {user.plan === 'enterprise' ? 'Enterprise' : user.plan === 'pro' ? 'Pro' : 'Básico'}
                    </span>
                  </div>
                  <div className="col-span-3 flex items-center justify-end space-x-2">
                    {user.role !== 'admin' && user.id !== currentUser?.id && (
                      <button onClick={() => handleDeleteUser(user.id, user.email)} className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded" title="Eliminar usuario">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {activeTab === 'create' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-gray-900/30 to-blue-900/20 p-4 rounded-lg border border-gray-800/50">
            <h4 className="font-medium text-white mb-2 flex items-center">
              <UserPlus className="w-5 h-5 mr-2 text-blue-400" /> Crear Nuevo Usuario
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Email</label>
                <input type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} placeholder="nuevo@cliente.com" className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Nombre</label>
                <input type="text" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} placeholder="Nombre del cliente" className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Contraseña</label>
                <div className="flex gap-2">
                  <input type="text" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} placeholder="Contraseña" className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white" />
                  <button onClick={generateRandomPassword} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">Generar</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Rol</label>
                  <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)} className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white">
                    <option value="client">Cliente</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Plan</label>
                  <select value={newUserPlan} onChange={(e) => setNewUserPlan(e.target.value)} className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white">
                    <option value="basic">Básico</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
              </div>
              <button onClick={handleCreateUser} className="w-full py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-lg flex items-center justify-center">
                <Check className="w-5 h-5 mr-2" /> Crear Usuario
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-800/30">
        <p className="text-xs text-gray-500 text-center">🔒 Usuarios gestionados desde el backend (JWT + bcrypt)</p>
      </div>
      {generatedPassword && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center">
        <Key className="w-5 h-5 mr-2 text-green-400" />
        Usuario Creado
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Email</label>
          <div className="p-2 bg-gray-800 rounded text-white font-mono text-sm">
            {generatedPassword.email}
          </div>
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-1">Contraseña</label>
          <div className="p-2 bg-gray-800 rounded text-white font-mono text-sm break-all">
            {generatedPassword.password}
          </div>
        </div>
        
        <div className="flex space-x-3 pt-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(`${generatedPassword.email}\n${generatedPassword.password}`);
              showMessage('📋 Credenciales copiadas', 'success');
            }}
            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copiar Email + Password
          </button>
          <button
            onClick={() => setGeneratedPassword(null)}
            className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default UserManagement;
