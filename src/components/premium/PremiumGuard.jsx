// src/components/premium/PremiumGuard.jsx
import { Navigate } from 'react-router-dom';

const PremiumGuard = ({ children }) => {
  // Leemos de localStorage (después lo cambiaremos por un hook real)
  const esPremium = localStorage.getItem('esPremium') === 'true';
  
  if (!esPremium) {
    return <Navigate to="/upgrade" replace />;
  }
  
  return children;
};

export default PremiumGuard;  // <--- TIENE QUE ESTAR ASÍ