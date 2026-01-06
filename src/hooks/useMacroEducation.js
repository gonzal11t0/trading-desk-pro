import { useEffect } from 'react';
import { useEducationStore } from '../stores/useEducationStore';

export const useMacroEducation = () => {
  const { 
    showButton, 
    setShowButton, 
    userClosed, 
    lastClosedTime 
  } = useEducationStore();

  useEffect(() => {
    const checkAndShow = () => {
      if (userClosed && lastClosedTime) {
        // Si cerró, revisamos si pasó 1 minuto
        const timeSinceClose = Date.now() - lastClosedTime;
        const oneMinute = 60000; // 1 minuto en ms
        
        if (timeSinceClose >= oneMinute) {
          // Pasó 1 minuto, mostramos de nuevo
          useEducationStore.getState().resetButton();
          setShowButton(true);
        }
      } else if (!userClosed) {
        // Si no cerró, mostramos cada 10 segundos
        setShowButton(true);
      }
    };

    // Intervalo de revisión: cada 10 segundos
    const interval = setInterval(checkAndShow, 10000);
    
    // Mostrar por primera vez después de 3 segundos (opcional)
    const initialTimer = setTimeout(() => {
      if (!userClosed) {
        setShowButton(true);
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, [userClosed, lastClosedTime, setShowButton]);

  return {
    showButton,
    userClosed,
    lastClosedTime
  };
};