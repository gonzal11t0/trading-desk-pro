// src/components/premium/PremiumGuard.jsx
import { Navigate } from 'react-router-dom';

const USUARIOS_AUTORIZADOS = [
  'admin@tradingdesk.com',        // Tu email
  'clienteLeo@empresa.com'           // Email de tu asesor
];

const PremiumGuard = ({ children }) => {
  const esPremium = localStorage.getItem('esPremium') === 'true';
  const emailUsuario = localStorage.getItem('userEmail');
  
  // Si es premium O es usuario autorizado, deja pasar
  if (esPremium || USUARIOS_AUTORIZADOS.includes(emailUsuario)) {
    return children;
  }
  
  return <Navigate to="/upgrade" replace />;
};

export default PremiumGuard;