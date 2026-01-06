export const MACRO_INDICATORS = [
  // ==================== MONETARIOS Y FINANCIEROS ====================
  {
    id: 'RESERVAS',
    nombre: 'Reservas Internacionales',
    categoria: 'Monetario',
    definicion: 'Fondos en moneda extranjera que posee el BCRA.',
    unidad: 'USD millones',
    frecuencia: 'Diaria',
    fuente: 'BCRA',
    interpretacion: {
      sube: 'Mayor solvencia, confianza, menor presión sobre el dólar.',
      baja: 'Riesgo de crisis cambiaria, posible devaluación, suba del riesgo país.'
    },
    relaciones: {
      dolar: 'inversa',
      inflacion: 'indirecta',
      riesgo_pais: 'inversa'
    },
    nota: 'Se considera saludable que cubran al menos 6 meses de importaciones.'
  },
  {
    id: 'BASE_MONETARIA',
    nombre: 'Base Monetaria',
    categoria: 'Monetario',
    definicion: 'Dinero en circulación más reservas bancarias en el BCRA.',
    unidad: 'ARS millones',
    frecuencia: 'Semanal',
    fuente: 'BCRA',
    interpretacion: {
      sube: 'Más liquidez, posible presión inflacionaria, puede depreciar el peso.',
      baja: 'Menor inflación, pero riesgo de contracción económica.'
    },
    relaciones: {
      inflacion: 'directa',
      dolar: 'directa',
      tasas: 'indirecta'
    },
    nota: 'Es la base para la creación de dinero bancario (M2, M3).'
  },
  {
    id: 'M2',
    nombre: 'M2 (Oferta Monetaria)',
    categoria: 'Monetario',
    definicion: 'Suma de circulante, depósitos a la vista y a plazo en pesos.',
    unidad: 'ARS millones',
    frecuencia: 'Mensual',
    fuente: 'BCRA',
    interpretacion: {
      sube: 'Mayor capacidad de gasto e inversión, pero riesgo inflacionario.',
      baja: 'Menor presión inflacionaria, pero posible recesión.'
    },
    relaciones: {
      inflacion: 'directa',
      pbi: 'directa',
      consumo: 'directa'
    },
    nota: 'Incluye dinero “casi líquido” como plazos fijos.'
  },
  {
    id: 'TASA_POLITICA',
    nombre: 'Tasa de Política Monetaria',
    categoria: 'Monetario',
    definicion: 'Tasa de referencia que fija el BCRA para orientar el costo del dinero.',
    unidad: '% anual',
    frecuencia: 'Reuniones del BCRA',
    fuente: 'BCRA',
    interpretacion: {
      sube: 'Frena la inflación, atrae capitales, encarece el crédito.',
      baja: 'Estimula la economía, abarata créditos, puede acelerar inflación.'
    },
    relaciones: {
      inflacion: 'inversa',
      dolar: 'inversa',
      riesgo_pais: 'inversa'
    },
    nota: 'Herramienta clave para control inflacionario.'
  },
  {
    id: 'TASA_LELIQ',
    nombre: 'Tasa de LELIQ / Depósitos',
    categoria: 'Monetario',
    definicion: 'Rendimiento de las letras de liquidez del BCRA y depósitos bancarios.',
    unidad: '% anual',
    frecuencia: 'Diaria',
    fuente: 'BCRA',
    interpretacion: {
      sube: 'Atrae pesos, frena la fuga al dólar, pero encarece el financiamiento.',
      baja: 'Desalienta el ahorro en pesos, puede aumentar dolarización.'
    },
    relaciones: {
      dolar: 'inversa',
      inflacion: 'directa'
    },
    nota: 'Refleja el costo de captación de pesos por parte del sistema financiero.'
  },
  {
    id: 'DEFICIT_FISCAL',
    nombre: 'Déficit Fiscal',
    categoria: 'Fiscal',
    definicion: 'Diferencia entre gastos e ingresos del Estado.',
    unidad: '% del PBI',
    frecuencia: 'Trimestral',
    fuente: 'Ministerio de Economía',
    interpretacion: {
      sube: 'Mayor necesidad de financiamiento, emisión o deuda, presión inflacionaria.',
      baja: 'Menor riesgo macroeconómico, mayor credibilidad internacional.'
    },
    relaciones: {
      inflacion: 'directa',
      riesgo_pais: 'directa',
      deuda: 'directa'
    },
    nota: 'Un déficit crónico suele terminar en crisis cambiaria o inflación alta.'
  },
  {
    id: 'DEUDA_PUBLICA',
    nombre: 'Deuda Pública',
    categoria: 'Fiscal',
    definicion: 'Obligaciones financieras totales del Estado.',
    unidad: 'USD miles de millones',
    frecuencia: 'Trimestral',
    fuente: 'Ministerio de Economía / BCRA',
    interpretacion: {
      sube: 'Mayor carga de intereses, vulnerabilidad a shocks, presión sobre reservas.',
      baja: 'Mayor margen fiscal, menor riesgo país.'
    },
    relaciones: {
      riesgo_pais: 'directa',
      reservas: 'inversa',
      deficit: 'directa'
    },
    nota: 'Se suele medir como porcentaje del PBI para comparar entre países.'
  },

  // ==================== INFLACIÓN Y PRECIOS ====================
  {
    id: 'IPC_MENSUAL',
    nombre: 'IPC Mensual',
    categoria: 'Inflación',
    definicion: 'Variación porcentual mensual del Índice de Precios al Consumidor.',
    unidad: '% mensual',
    frecuencia: 'Mensual',
    fuente: 'INDEC',
    interpretacion: {
      sube: 'Pérdida de poder adquisitivo, presión para ajustar salarios y tarifas.',
      baja: 'Alivio en costos de vida, mayor certidumbre para planificación.'
    },
    relaciones: {
      dolar: 'directa',
      tasas: 'directa',
      salario_real: 'inversa'
    },
    nota: 'El IPC argentino es uno de los más altos del mundo en las últimas décadas.'
  },
  {
    id: 'IPC_ANUAL',
    nombre: 'IPC Anual',
    categoria: 'Inflación',
    definicion: 'Inflación acumulada en los últimos 12 meses.',
    unidad: '% anual',
    frecuencia: 'Mensual',
    fuente: 'INDEC',
    interpretacion: {
      sube: 'Refleja inercia inflacionaria, impacta contratos y expectativas.',
      baja: 'Señal de desaceleración, puede permitir baja de tasas.'
    },
    relaciones: {
      expectativas_inflacion: 'directa',
      dolar: 'directa'
    },
    nota: 'Meta de inflación del BCRA para 2025: 5-7% anual (en discusión).'
  },
  {
    id: 'EXPECTATIVAS_INFLACION',
    nombre: 'Expectativas de Inflación (REM)',
    categoria: 'Inflación',
    definicion: 'Proyección de inflación futura según encuesta a economistas (REM).',
    unidad: '% anual esperado',
    frecuencia: 'Mensual',
    fuente: 'BCRA',
    interpretacion: {
      sube: 'Mayor desconfianza, presiona ajustes salariales y cambiarios.',
      baja: 'Mayor credibilidad en la política monetaria.'
    },
    relaciones: {
      ipc: 'directa',
      tasas: 'directa',
      dolar: 'directa'
    },
    nota: 'Las expectativas suelen convertirse en profecías autocumplidas.'
  },

  // ==================== TIPO DE CAMBIO ====================
  {
    id: 'DOLAR_OFICIAL',
    nombre: 'Dólar Oficial',
    categoria: 'Tipo de Cambio',
    definicion: 'Cotización regulada por el BCRA para operaciones formales.',
    unidad: 'ARS por USD',
    frecuencia: 'Diaria',
    fuente: 'BCRA',
    interpretacion: {
      sube: 'Encarece importaciones, abarata exportaciones, presión inflacionaria.',
      baja: 'Alivia costos internos, pero puede afectar competitividad.'
    },
    relaciones: {
      inflacion: 'directa',
      reservas: 'inversa',
      brecha: 'directa'
    },
    nota: 'Sujeto a controles y restricciones cambiarias.'
  },
  {
    id: 'DOLAR_BLUE',
    nombre: 'Dólar Blue',
    categoria: 'Tipo de Cambio',
    definicion: 'Cotización informal en el mercado paralelo.',
    unidad: 'ARS por USD',
    frecuencia: 'Diaria',
    fuente: 'Bluelytics / DolarAPI',
    interpretacion: {
      sube: 'Refleja escasez de dólares oficiales, desconfianza, presión de ahorristas.',
      baja: 'Mayor oferta informal, confianza temporal, menor demanda refugio.'
    },
    relaciones: {
      brecha: 'directa',
      reservas: 'inversa',
      riesgo_pais: 'directa'
    },
    nota: 'La brecha con el oficial indica distorsión del mercado cambiario.'
  },
  {
    id: 'DOLAR_MEP',
    nombre: 'Dólar MEP',
    categoria: 'Tipo de Cambio',
    definicion: 'Cotización implícita al comprar bonos en pesos y vender en dólares.',
    unidad: 'ARS per USD',
    frecuencia: 'Intradiaria',
    fuente: 'BYMA / Mercados',
    interpretacion: {
      sube: 'Mayor presión dolarizadora de portafolios, señal de expectativas devaluatorias.',
      baja: 'Menor demanda de cobertura cambiaria vía bonos.'
    },
    relaciones: {
      brecha: 'directa',
      bonos: 'directa',
      riesgo_pais: 'directa'
    },
    nota: 'Accesible para inversores con cuenta en broker regulado.'
  },
  {
    id: 'DOLAR_CCL',
    nombre: 'Dólar CCL (Contado con Liquidación)',
    categoria: 'Tipo de Cambio',
    definicion: 'Cotización implícita al comprar bonos en USD y vender en pesos.',
    unidad: 'ARS per USD',
    frecuencia: 'Intradiaria',
    fuente: 'BYMA / Mercados',
    interpretacion: {
      sube: 'Fuga de capitales vía mercado de capitales, presión sobre reservas.',
      baja: 'Menor salida de dólares, confianza en mercados locales.'
    },
    relaciones: {
      reservas: 'inversa',
      bonos: 'directa',
      brecha: 'directa'
    },
    nota: 'Usado por empresas para girar dividendos al exterior.'
  },
  {
    id: 'BRECHA_CAMBIARIA',
    nombre: 'Brecha Cambiaria',
    categoria: 'Tipo de Cambio',
    definicion: 'Diferencia porcentual entre el dólar blue/oficial y el oficial.',
    unidad: '%',
    frecuencia: 'Diaria',
    fuente: 'Cálculo interno',
    interpretacion: {
      sube: 'Mayor distorsión, incentivo a la informalidad, señal de controles insostenibles.',
      baja: 'Mercado más unificado, menor arbitraje ilegal.'
    },
    relaciones: {
      dolar_blue: 'directa',
      reservas: 'inversa',
      inflacion: 'directa'
    },
    nota: 'Brecha crónica alta suele preceder devaluaciones.'
  },

  // ==================== MERCADOS Y RIESGO ====================
  {
    id: 'EMBI',
    nombre: 'Riesgo País (EMBI+)',
    categoria: 'Riesgo',
    definicion: 'Diferencial de tasa que exigen los bonos argentinos vs. los de EE.UU.',
    unidad: 'puntos básicos',
    frecuencia: 'Intradiaria',
    fuente: 'JP Morgan / Mercados',
    interpretacion: {
      sube: 'Mayor percepción de riesgo, encarece financiamiento externo.',
      baja: 'Mejora de confianza, acceso a mercados más barato.'
    },
    relaciones: {
      reservas: 'inversa',
      deuda: 'directa',
      dolar: 'directa'
    },
    nota: 'Por encima de 1000 puntos se considera “bono basura”.'
  },
  {
    id: 'MERVAL',
    nombre: 'Índice MERVAL',
    categoria: 'Mercado',
    definicion: 'Principal índice de la Bolsa de Buenos Aires (en pesos).',
    unidad: 'Puntos',
    frecuencia: 'Intradiaria',
    fuente: 'BYMA',
    interpretacion: {
      sube: 'Expectativas positivas sobre empresas locales, flujos hacia activos en pesos.',
      baja: 'Desconfianza, fuga hacia dólares o activos externos.'
    },
    relaciones: {
      dolar: 'inversa',
      riesgo_pais: 'inversa',
      pbi: 'directa'
    },
    nota: 'Sensible a noticias políticas y cambiarias.'
  },
  {
    id: 'BONOS_SOBERANOS',
    nombre: 'Bonos Soberanos (GD30, AL30, etc.)',
    categoria: 'Mercado',
    definicion: 'Títulos de deuda pública argentina cotizados en dólares y pesos.',
    unidad: 'Precio (USD) / TIR (%)',
    frecuencia: 'Intradiaria',
    fuente: 'BYMA / Mercados',
    interpretacion: {
      sube: 'Mejora de confianza en solvencia, menor rendimiento exigido.',
      baja: 'Temor a default, mayor exigencia de retorno.'
    },
    relaciones: {
      riesgo_pais: 'inversa',
      reservas: 'directa',
      dolar: 'inversa'
    },
    nota: 'GD30 y AL30 son los más líquidos y referenciales.'
  },

  // ==================== INDICADORES REALES (INDEC) ====================
  {
    id: 'PBI',
    nombre: 'PBI Trimestral',
    categoria: 'Real',
    definicion: 'Valor total de bienes y servicios producidos en un trimestre.',
    unidad: 'Variación % interanual',
    frecuencia: 'Trimestral',
    fuente: 'INDEC',
    interpretacion: {
      sube: 'Expansión económica, mayor empleo, mejora recaudación.',
      baja: 'Recesión, desempleo, menor consumo e inversión.'
    },
    relaciones: {
      desempleo: 'inversa',
      consumo: 'directa',
      deficit: 'inversa'
    },
    nota: 'Argentina tiene historial de alta volatilidad en crecimiento.'
  },
  {
    id: 'DESEMPLEO',
    nombre: 'Tasa de Desempleo',
    categoria: 'Real',
    definicion: 'Porcentaje de la población activa que busca trabajo y no lo encuentra.',
    unidad: '%',
    frecuencia: 'Trimestral',
    fuente: 'INDEC (EPH)',
    interpretacion: {
      sube: 'Menor consumo, presión social, posible aumento de subsidios.',
      baja: 'Mayor poder adquisitivo, crecimiento inclusivo.'
    },
    relaciones: {
      consumo: 'inversa',
      pbi: 'inversa',
      salarios: 'directa'
    },
    nota: 'Incluye trabajo informal y subempleo.'
  },
  {
    id: 'BALANZA_COMERCIAL',
    nombre: 'Balanza Comercial',
    categoria: 'Real',
    definicion: 'Diferencia entre exportaciones e importaciones.',
    unidad: 'USD millones',
    frecuencia: 'Mensual',
    fuente: 'INDEC',
    interpretacion: {
      sube: 'Superávit: genera dólares, alivia reservas.',
      baja: 'Déficit: consume dólares, presiona reservas.'
    },
    relaciones: {
      reservas: 'directa',
      dolar: 'inversa',
      actividad: 'directa'
    },
    nota: 'Argentina suele ser superavitaria por agroexportaciones.'
  },
  {
    id: 'EMAE',
    nombre: 'Estimador Mensual de Actividad Económica (EMAE)',
    categoria: 'Real',
    definicion: 'Indicador mensual que aproxima la evolución del PBI.',
    unidad: 'Variación % interanual',
    frecuencia: 'Mensual',
    fuente: 'INDEC',
    interpretacion: {
      sube: 'Aceleración económica adelantada.',
      baja: 'Desaceleración o recesión temprana.'
    },
    relaciones: {
      pbi: 'directa',
      consumo: 'directa',
      impuestos: 'directa'
    },
    nota: 'Más oportuno que el PBI trimestral.'
  },
  {
    id: 'CONSUMO_PRIVADO',
    nombre: 'Consumo Privado',
    categoria: 'Real',
    definicion: 'Gasto de hogares en bienes y servicios.',
    unidad: 'Variación % interanual',
    frecuencia: 'Trimestral',
    fuente: 'INDEC',
    interpretacion: {
      sube: 'Motor del crecimiento, pero puede presionar inflación e importaciones.',
      baja: 'Enfría la economía, reduce presión inflacionaria.'
    },
    relaciones: {
      pbi: 'directa',
      importaciones: 'directa',
      salarios: 'directa'
    },
    nota: 'Altamente sensible al poder adquisitivo real.'
  },
  {
    id: 'SALARIO_REAL',
    nombre: 'Salario Real',
    categoria: 'Real',
    definicion: 'Salario nominal ajustado por inflación.',
    unidad: 'Variación % interanual',
    frecuencia: 'Trimestral',
    fuente: 'INDEC',
    interpretacion: {
      sube: 'Mayor poder adquisitivo, bienestar social, consumo sostenible.',
      baja: 'Pérdida de calidad de vida, conflicto social, menor consumo.'
    },
    relaciones: {
      consumo: 'directa',
      inflacion: 'inversa',
      desempleo: 'inversa'
    },
    nota: 'En Argentina suele perder contra la inflación en períodos de crisis.'
  },
  {
    id: 'IED',
    nombre: 'Inversión Extranjera Directa',
    categoria: 'Real',
    definicion: 'Inversión de largo plazo de empresas extranjeras en el país.',
    unidad: 'USD millones',
    frecuencia: 'Trimestral',
    fuente: 'BCRA / INDEC',
    interpretacion: {
      sube: 'Confianza en el país, creación de empleo, entrada de dólares.',
      baja: 'Desconfianza institucional, fuga de capitales, menor desarrollo.'
    },
    relaciones: {
      reservas: 'directa',
      pbi: 'directa',
      riesgo_pais: 'inversa'
    },
    nota: 'Sensible a reglas de juego y estabilidad jurídica.'
  },
  {
    id: 'ISAC',
    nombre: 'Índice de Salarios (ISAC)',
    categoria: 'Real',
    definicion: 'Evolución promedio de los salarios registrados.',
    unidad: 'Variación % interanual',
    frecuencia: 'Mensual',
    fuente: 'INDEC',
    interpretacion: {
      sube: 'Mejora nominal del ingreso, pero puede trasladarse a precios.',
      baja: 'Ajuste en poder adquisitivo, menor presión inflacionaria.'
    },
    relaciones: {
      inflacion: 'directa',
      consumo: 'directa',
      costos: 'directa'
    },
    nota: 'Clave para negociaciones paritarias.'
  },
  {
    id: 'CONFIANZA_CONSUMIDOR',
    nombre: 'Confianza del Consumidor',
    categoria: 'Real',
    definicion: 'Encuesta que mide la percepción de hogares sobre situación económica futura.',
    unidad: 'Índice',
    frecuencia: 'Mensual',
    fuente: 'UTDT / UCEMA',
    interpretacion: {
      sube: 'Mayor propensión a consumir, optimismo económico.',
      baja: 'Ahorro preventivo, pesimismo, consumo postergado.'
    },
    relaciones: {
      consumo: 'directa',
      ventas: 'directa',
      inflacion: 'inversa'
    },
    nota: 'Indicador adelantado del consumo futuro.'
  },

  // ==================== INTERNACIONAL ====================
  {
    id: 'TASA_FED',
    nombre: 'Tasa de Interés de la FED',
    categoria: 'Internacional',
    definicion: 'Tasa de fondos federales de EE.UU., fijada por la Reserva Federal.',
    unidad: '% anual',
    frecuencia: 'Reuniones periódicas',
    fuente: 'Federal Reserve',
    interpretacion: {
      sube: 'Mayor rendimiento en dólares, fuga de capitales desde emergentes, dólar fuerte.',
      baja: 'Mayor liquidez global, búsqueda de yield en mercados emergentes, dólar débil.'
    },
    relaciones: {
      dolar: 'directa',
      riesgo_pais: 'directa',
      reservas: 'inversa'
    },
    nota: 'Es el principal referente mundial para el costo del dinero en USD.'
  },
  {
    id: 'SP500',
    nombre: 'S&P 500',
    categoria: 'Internacional',
    definicion: 'Índice bursátil de las 500 mayores empresas de EE.UU.',
    unidad: 'Puntos',
    frecuencia: 'Intradiaria',
    fuente: 'NYSE / NASDAQ',
    interpretacion: {
      sube: 'Optimismo global, aversión al riesgo baja, fluye capital a acciones.',
      baja: 'Temor recesión, aversión al riesgo alta, fuga a bonos o oro.'
    },
    relaciones: {
      riesgo_pais: 'inversa',
      commodites: 'directa',
      tasa_fed: 'inversa'
    },
    nota: 'Referencia global de riesgo y crecimiento económico.'
  },
  {
    id: 'PETROLEO_WTI',
    nombre: 'Petróleo WTI',
    categoria: 'Internacional',
    definicion: 'Precio del crudo West Texas Intermediate (referencia EE.UU.).',
    unidad: 'USD por barril',
    frecuencia: 'Intradiaria',
    fuente: 'CME / NYMEX',
    interpretacion: {
      sube: 'Mayor costo energético mundial, inflación importada, beneficia exportadores.',
      baja: 'Alivio inflacionario, menor costo logístico, perjudica productores.'
    },
    relaciones: {
      inflacion: 'directa',
      actividad: 'inversa',
      commodites: 'directa'
    },
    nota: 'Impacta en precios de combustibles, transporte y plásticos.'
  }
];

export const MACRO_CATEGORIES = [
  'Monetario',
  'Inflación',
  'Tipo de Cambio',
  'Riesgo',
  'Mercado',
  'Real',
  'Internacional',
  'Fiscal'
];