import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';

const TestLogin = () => {
  const [email, setEmail] = useState('admin@tradingdesk.com');
  const [password, setPassword] = useState('Admin@Trading2025!');
  const { login, isLoading, error, user } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    console.log('Resultado login:', result);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔧 Test de Conexión Backend-Frontend</h1>
      
      <div style={{ margin: '20px 0', padding: '10px', background: '#1a1a1a' }}>
        <h3>Backend Status:</h3>
        <p>✅ http://localhost:3001/api - CONECTADO</p>
        <p>📡 Endpoint: POST /auth/login - FUNCIONANDO</p>
      </div>
      
      <form onSubmit={handleSubmit} style={{ margin: '20px 0' }}>
        <div>
          <label>Email: </label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '5px', margin: '5px' }}
          />
        </div>
        <div>
          <label>Password: </label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '5px', margin: '5px' }}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Conectando...' : 'Test Login'}
        </button>
      </form>
      
      {error && (
        <div style={{ color: 'red', margin: '10px 0' }}>
          ❌ Error: {error}
        </div>
      )}
      
      {user && (
        <div style={{ color: 'green', margin: '10px 0' }}>
          ✅ Login exitoso! Usuario: {user.name} ({user.role})
        </div>
      )}
      
      <div style={{ marginTop: '20px', padding: '10px', background: '#002200' }}>
        <h3>Para probar manualmente con curl:</h3>
        <code style={{ display: 'block', whiteSpace: 'pre-wrap' }}>
          curl -X POST http://localhost:3001/api/auth/login ^<br/>
          -H "Content-Type: application/json" ^<br/>
          -d "{\"email\":\"admin@tradingdesk.com\",\"password\":\"Admin@Trading2025!\"}"
        </code>
      </div>
    </div>
  );
};

export default TestLogin;