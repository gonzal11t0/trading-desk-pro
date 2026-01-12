/* passwordinput */
import React, { useState, useCallback, useMemo } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { validatePassword } from '../../utils/authHelpers';

// Constantes fuera del componente
const REQUIREMENT_TEXTS = {
  minLength: 'Mínimo 6 caracteres',
  hasNumber: 'Al menos 1 número',
  hasUppercase: 'Al menos 1 mayúscula',
  hasLowercase: 'Al menos 1 minúscula',
  hasSpecialChar: 'Al menos 1 símbolo'
};

// Funciones helper fuera del componente
const getStrengthColor = (strength) => {
  if (strength < 40) return 'bg-red-500';
  if (strength < 60) return 'bg-orange-500';
  if (strength < 80) return 'bg-yellow-500';
  if (strength < 90) return 'bg-blue-500';
  return 'bg-green-500';
};

const getStrengthText = (strength) => {
  if (strength < 40) return 'Muy débil';
  if (strength < 60) return 'Débil';
  if (strength < 80) return 'Buena';
  if (strength < 90) return 'Fuerte';
  return 'Muy fuerte';
};

const getRequirementText = (key) => REQUIREMENT_TEXTS[key] || key;

const PasswordInput = ({
  value = '',
  onChange,
  onValidationChange,
  placeholder = 'Ingresa tu contraseña',
  id = 'password',
  name = 'password',
  disabled = false,
  showStrength = true,
  className = ''
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Validación memoizada
  const validation = useMemo(() => {
    if (!showStrength || !value) return null;
    return validatePassword(value);
  }, [value, showStrength]);

  // Notificar cambios en validación
  React.useEffect(() => {
    if (validation) {
      onValidationChange?.(validation);
    }
  }, [validation, onValidationChange]);

  // Handlers memoizados
  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    onChange?.(newValue);
  }, [onChange]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // Calcular color del borde
  const borderClass = useMemo(() => {
    if (!value) return 'border-gray-700';
    if (validation?.isValid) return 'border-green-500/30';
    return 'border-red-500/30';
  }, [value, validation]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-3 pl-10 pr-12
            bg-gray-800/50 border 
            ${borderClass}
            rounded-lg
            text-gray-100 placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
          autoComplete="current-password"
        />
        
        {/* Ícono de candado */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        {/* Botón mostrar/ocultar */}
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
          tabIndex={-1}
          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Indicador de fortaleza */}
      {showStrength && value && validation && (
        <StrengthIndicator validation={validation} />
      )}
    </div>
  );
};

// Componente memoizado para el indicador de fortaleza
const StrengthIndicator = React.memo(({ validation }) => {
  const strengthColor = getStrengthColor(validation.strength);
  const strengthText = getStrengthText(validation.strength);
  const strengthPercent = Math.round(validation.strength);
  
  const textColor = validation.strength < 60 ? 'text-red-400' :
                   validation.strength < 80 ? 'text-yellow-400' :
                   'text-green-400';

  return (
    <div className="space-y-2">
      {/* Barra de progreso */}
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${strengthColor} transition-all duration-500`}
          style={{ width: `${Math.min(100, validation.strength)}%` }}
        />
      </div>

      {/* Texto y porcentaje */}
      <div className="flex justify-between items-center text-sm">
        <span className={`font-medium ${textColor}`}>
          {strengthText}
        </span>
        <span className="text-gray-400">{strengthPercent}%</span>
      </div>

      {/* Lista de requisitos */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        {Object.entries(validation.validations).map(([key, isValid]) => (
          <RequirementItem key={key} requirementKey={key} isValid={isValid} />
        ))}
      </div>
    </div>
  );
});

// Componente memoizado para cada requisito
const RequirementItem = React.memo(({ requirementKey, isValid }) => {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
        isValid ? 'bg-green-500/20' : 'bg-red-500/20'
      }`}>
        {isValid ? (
          <Check className="w-3 h-3 text-green-400" />
        ) : (
          <X className="w-3 h-3 text-red-400" />
        )}
      </div>
      <span className={`text-xs ${isValid ? 'text-green-400' : 'text-gray-500'}`}>
        {getRequirementText(requirementKey)}
      </span>
    </div>
  );
});

// Memoizar el componente principal
export default React.memo(PasswordInput);