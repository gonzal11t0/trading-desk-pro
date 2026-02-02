import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Search, Filter, BookOpen, TrendingUp, DollarSign, 
  PieChart, Globe, Building, BarChart3, ChevronRight,
  Clock, Download, Share2, Star, Zap, Target, TrendingDown,
  Info, ExternalLink, Grid, List, Bookmark, Eye
} from 'lucide-react';
import { useEducationStore } from '../../../stores/useEducationStore';
import { MACRO_INDICATORS, MACRO_CATEGORIES } from './MacroData';
import IndicatorCard from './IndicatorCard';

const MacroExplainer = () => {
  const { isExplainerOpen, closeExplainer, activeIndicatorId } = useEducationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);

  // Efecto para focus en search al abrir
  useEffect(() => {
    if (isExplainerOpen && searchRef.current) {
      setTimeout(() => {
        searchRef.current.focus();
      }, 300);
    }
  }, [isExplainerOpen]);

  // Filtrar indicadores
  const filteredIndicators = MACRO_INDICATORS.filter(indicator => {
    const matchesSearch = 
      indicator.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      indicator.definicion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      indicator.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'Todos' || indicator.categoria === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Indicador activo
  const activeIndicator = activeIndicatorId 
    ? MACRO_INDICATORS.find(ind => ind.id === activeIndicatorId)
    : null;

  // Iconos por categoría
  const categoryIcons = {
    'Monetario': <DollarSign className="w-4 h-4 md:w-5 md:h-5" />,
    'Inflación': <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />,
    'Tipo de Cambio': <DollarSign className="w-4 h-4 md:w-5 md:h-5" />,
    'Riesgo': <BarChart3 className="w-4 h-4 md:w-5 md:h-5" />,
    'Mercado': <PieChart className="w-4 h-4 md:w-5 md:h-5" />,
    'Real': <Building className="w-4 h-4 md:w-5 md:h-5" />,
    'Internacional': <Globe className="w-4 h-4 md:w-5 md:h-5" />,
    'Fiscal': <Building className="w-4 h-4 md:w-5 md:h-5" />
  };

  // Colores por categoría
  const categoryColors = {
    'Monetario': { bg: '#3b82f6', text: '#ffffff', light: '#dbeafe' },
    'Inflación': { bg: '#ef4444', text: '#ffffff', light: '#fee2e2' },
    'Tipo de Cambio': { bg: '#10b981', text: '#ffffff', light: '#d1fae5' },
    'Riesgo': { bg: '#8b5cf6', text: '#ffffff', light: '#ede9fe' },
    'Mercado': { bg: '#f59e0b', text: '#ffffff', light: '#fef3c7' },
    'Real': { bg: '#06b6d4', text: '#ffffff', light: '#cffafe' },
    'Internacional': { bg: '#ec4899', text: '#ffffff', light: '#fce7f3' },
    'Fiscal': { bg: '#f97316', text: '#ffffff', light: '#ffedd5' }
  };

  // Toggle favorito
  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  // Indicadores populares (más vistos/favoritos)
  const popularIndicators = MACRO_INDICATORS
    .filter(ind => ['RESERVAS', 'IPC_MENSUAL', 'DOLAR_BLUE', 'EMBI', 'PBI'].includes(ind.id))
    .slice(0, 5);

  if (!isExplainerOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 animate-fadeIn">
        {/* Main Container */}
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 animate-slideUp">
          {/* Header Premium */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 md:p-8 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-5 md:mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <BookOpen className="w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3 mb-2">
                      Guía de Indicadores Macroeconómicos
                      <span className="text-sm font-normal bg-white/20 px-3 py-1 rounded-full inline-flex items-center gap-1.5 w-fit">
                        <Zap className="w-3 h-3 md:w-4 md:h-4" />
                        PRO
                      </span>
                    </h1>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-4 text-sm md:text-base opacity-90">
                      <span className="flex items-center gap-1.5">
                        <Target className="w-4 h-4 md:w-5 md:h-5" />
                        {MACRO_INDICATORS.length} indicadores disponibles
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 md:w-5 md:h-5" />
                        Actualizado hoy
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 md:gap-4">
                  <button
                    onClick={() => {}}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl flex items-center gap-2 transition-all duration-200 text-sm md:text-base"
                  >
                    <Download className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden sm:inline">PDF</span>
                  </button>
                  <button
                    onClick={() => {}}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl flex items-center gap-2 transition-all duration-200 text-sm md:text-base"
                  >
                    <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden sm:inline">Compartir</span>
                  </button>
                  <button
                    onClick={closeExplainer}
                    className="bg-white/20 hover:bg-white/30 text-white p-2 md:p-3 rounded-lg md:rounded-xl transition-all duration-200"
                    aria-label="Cerrar"
                  >
                    <X className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-2xl">
                <div className={`relative bg-white/15 rounded-xl md:rounded-2xl border-2 transition-all duration-300 ${
                  isSearchFocused ? 'border-white/50' : 'border-transparent'
                } flex items-center`}>
                  <Search className="w-4 h-4 md:w-5 md:h-5 text-white/70 absolute left-3 md:left-4" />
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Buscar indicador (ej: Reservas, IPC, EMBI, Dólar Blue...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="w-full pl-10 md:pl-12 pr-10 md:pr-12 py-3 md:py-4 bg-transparent border-none text-white text-sm md:text-base placeholder-white/70 outline-none"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 md:right-4 bg-none border-none text-white/70 p-1 cursor-pointer"
                    >
                      <X className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden bg-gray-50">
            {/* Sidebar - Categories */}
            <div className="hidden lg:flex flex-col w-64 md:w-72 border-r border-gray-200 bg-white p-4 md:p-6 overflow-y-auto animate-slideInRight">
              <div className="mb-6 md:mb-8">
                <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-3 md:mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <Filter className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                  CATEGORÍAS
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory('Todos')}
                    className={`w-full text-left px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl text-sm md:text-base font-medium flex items-center gap-3 transition-all duration-200 ${
                      selectedCategory === 'Todos' 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-800 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Grid className={`w-4 h-4 md:w-5 md:h-5 ${
                      selectedCategory === 'Todos' ? 'text-blue-600' : 'text-gray-500'
                    }`} />
                    <span>Todos los indicadores</span>
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${
                      selectedCategory === 'Todos' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {MACRO_INDICATORS.length}
                    </span>
                  </button>
                  
                  {MACRO_CATEGORIES.map(cat => {
                    const count = MACRO_INDICATORS.filter(ind => ind.categoria === cat).length;
                    const color = categoryColors[cat];
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl text-sm md:text-base font-medium flex items-center gap-3 transition-all duration-200 ${
                          selectedCategory === cat 
                            ? 'bg-gray-50' 
                            : 'text-gray-800 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        style={{
                          backgroundColor: selectedCategory === cat ? color.light : undefined,
                          color: selectedCategory === cat ? color.bg : undefined
                        }}
                      >
                        <div style={{ color: selectedCategory === cat ? color.bg : '#6b7280' }}>
                          {categoryIcons[cat]}
                        </div>
                        <span>{cat}</span>
                        <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${
                          selectedCategory === cat 
                            ? 'text-white' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                        style={{
                          backgroundColor: selectedCategory === cat ? color.bg : undefined
                        }}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Popular Indicators */}
              <div className="mb-6 md:mb-8">
                <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-3 md:mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                  MÁS CONSULTADOS
                </h3>
                <div className="space-y-2">
                  {popularIndicators.map(ind => (
                    <button
                      key={ind.id}
                      onClick={() => useEducationStore.getState().setActiveIndicator(ind.id)}
                      className="w-full flex items-center gap-3 p-2.5 md:p-3 rounded-lg md:rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all duration-200 text-left group"
                    >
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: categoryColors[ind.categoria].light,
                          color: categoryColors[ind.categoria].bg
                        }}
                      >
                        {categoryIcons[ind.categoria]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm md:text-base font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                          {ind.nombre}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 truncate">
                          {ind.fuente} • {ind.frecuencia}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Favorites */}
              {favorites.length > 0 && (
                <div>
                  <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-3 md:mb-4 flex items-center gap-2 uppercase tracking-wider">
                    <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500" />
                    Mis Favoritos
                  </h3>
                  <div className="space-y-1.5">
                    {favorites.slice(0, 3).map(favId => {
                      const ind = MACRO_INDICATORS.find(i => i.id === favId);
                      if (!ind) return null;
                      return (
                        <button
                          key={favId}
                          onClick={() => useEducationStore.getState().setActiveIndicator(favId)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg md:rounded-xl bg-yellow-50 hover:bg-yellow-100 transition-all duration-200 text-left"
                        >
                          <Star className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
                          <span className="text-sm text-yellow-900 truncate">
                            {ind.nombre}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Main Panel */}
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
              {/* Toolbar */}
              <div className="p-4 md:p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-3 md:px-4 py-2 rounded-lg md:rounded-xl flex items-center gap-2 transition-all duration-200 ${
                        viewMode === 'grid' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Grid className="w-4 h-4 md:w-5 md:h-5" />
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-3 md:px-4 py-2 rounded-lg md:rounded-xl flex items-center gap-2 transition-all duration-200 ${
                        viewMode === 'list' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <List className="w-4 h-4 md:w-5 md:h-5" />
                      Lista
                    </button>
                  </div>
                  
                  {searchTerm && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Info className="w-4 h-4" />
                      {filteredIndicators.length} resultados para "{searchTerm}"
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-3 md:gap-4">
                  <button
                    onClick={closeExplainer}
                    className="px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:-translate-y-0.5 text-sm md:text-base"
                  >
                    Comenzar Exploración
                  </button>
                </div>
              </div>

              {/* Indicators Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
                {activeIndicator ? (
                  <div className="animate-fadeIn">
                    <button
                      onClick={() => useEducationStore.getState().setActiveIndicator(null)}
                      className="mb-4 md:mb-6 text-blue-600 bg-blue-50 border-none px-4 py-2.5 rounded-lg md:rounded-xl cursor-pointer flex items-center gap-2 hover:bg-blue-100 transition-all duration-200 text-sm md:text-base"
                    >
                      <ChevronRight className="w-4 h-4 rotate-180" />
                      Volver a la lista
                    </button>
                    <IndicatorCard indicator={activeIndicator} />
                  </div>
                ) : filteredIndicators.length > 0 ? (
                  viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                      {filteredIndicators.map(indicator => {
                        const color = categoryColors[indicator.categoria];
                        return (
                          <div
                            key={indicator.id}
                            onClick={() => useEducationStore.getState().setActiveIndicator(indicator.id)}
                            className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 cursor-pointer transition-all duration-300 border border-gray-200 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 animate-slideUp"
                          >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3 md:gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center"
                                  style={{
                                    backgroundColor: color.light,
                                    color: color.bg
                                  }}
                                >
                                  {categoryIcons[indicator.categoria]}
                                </div>
                                <div>
                                  <h3 className="text-sm md:text-base lg:text-lg font-semibold text-gray-900 mb-1">
                                    {indicator.nombre}
                                  </h3>
                                  <span className="text-xs px-2 py-1 rounded-full font-medium"
                                    style={{
                                      backgroundColor: color.light,
                                      color: color.bg
                                    }}
                                  >
                                    {indicator.categoria}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(indicator.id);
                                }}
                                className={`bg-none border-none p-1 cursor-pointer ${
                                  favorites.includes(indicator.id) ? 'text-yellow-500' : 'text-gray-300'
                                } hover:text-yellow-500 transition-colors`}
                              >
                                <Star className="w-4 h-4 md:w-5 md:h-5" />
                              </button>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-4 line-clamp-2">
                              {indicator.definicion}
                            </p>

                            {/* Footer */}
                            <div className="pt-3 md:pt-4 border-t border-gray-100 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {indicator.frecuencia}
                                </span>
                                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                  {indicator.fuente}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-blue-600 text-sm font-medium">
                                Ver detalles
                                <ChevronRight className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredIndicators.map(indicator => {
                        const color = categoryColors[indicator.categoria];
                        return (
                          <div
                            key={indicator.id}
                            onClick={() => useEducationStore.getState().setActiveIndicator(indicator.id)}
                            className="bg-white rounded-lg md:rounded-xl p-4 cursor-pointer transition-all duration-200 border border-gray-200 hover:bg-gray-50 hover:translate-x-1 flex items-center gap-4"
                          >
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{
                                backgroundColor: color.light,
                                color: color.bg
                              }}
                            >
                              {categoryIcons[indicator.categoria]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                                <h3 className="text-sm md:text-base font-semibold text-gray-900 truncate">
                                  {indicator.nombre}
                                </h3>
                                <span className="text-xs px-2 py-1 rounded-full font-medium flex-shrink-0"
                                  style={{
                                    backgroundColor: color.light,
                                    color: color.bg
                                  }}
                                >
                                  {indicator.categoria}
                                </span>
                              </div>
                              <p className="text-gray-500 text-xs md:text-sm line-clamp-1">
                                {indicator.definicion}
                              </p>
                            </div>
                            <div className="flex items-center gap-4 flex-shrink-0">
                              <div className="text-right">
                                <div className="text-xs text-gray-500 flex items-center gap-1 justify-end">
                                  <Clock className="w-3 h-3" />
                                  {indicator.frecuencia}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {indicator.fuente}
                                </div>
                              </div>
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                ) : (
                  <div className="text-center py-12 md:py-16 lg:py-24 text-gray-600">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 text-gray-400">
                      <Search className="w-8 h-8 md:w-10 md:h-10" />
                    </div>
                    <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-700 mb-2 md:mb-3">
                      No se encontraron indicadores
                    </h3>
                    <p className="text-sm md:text-base text-gray-500 max-w-md mx-auto mb-6 md:mb-8">
                      Intenta con otros términos de búsqueda o selecciona una categoría diferente
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('Todos');
                      }}
                      className="px-6 py-3 rounded-lg md:rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:-translate-y-0.5 text-sm md:text-base"
                    >
                      Mostrar todos los indicadores
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 md:p-6 border-t border-gray-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Eye className="w-4 h-4" />
                <span>Útil para: <strong className="text-gray-800">Inversores · Estudiantes · Analistas</strong></span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Bookmark className="w-4 h-4" />
                <span>Guardado automáticamente</span>
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <button
                onClick={() => window.open('https://www.bcra.gob.ar', '_blank')}
                className="px-3 md:px-4 py-2 rounded-lg md:rounded-xl border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-all duration-200 text-sm md:text-base"
              >
                <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">BCRA Oficial</span>
              </button>
              <button
                onClick={closeExplainer}
                className="px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 transition-all duration-200 text-sm md:text-base"
              >
                Cerrar Guía
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slideInRight {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.4s ease-out;
        }
      `}</style>
    </>
  );
};

export default MacroExplainer;