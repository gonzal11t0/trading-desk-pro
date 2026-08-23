export const BALANCE_SOURCES = {
  ALUA: { name: 'Aluar — Inversores', url: 'https://www.aluar.com.ar/inversores', sector: 'industrial' },
  CEPU: { name: 'Central Puerto — Resultados financieros', url: 'https://www.centralpuerto.com/resultados-financieros/', sector: 'industrial' },
  COME: { name: 'SCP — Información financiera', url: 'https://www.scp.com.ar/informacion_financiera', sector: 'industrial' },
  EDN: { name: 'Edenor — Memoria y estados financieros', url: 'https://www.edenor.com/inversores/es/informacion-financiera/memoria-y-estados-financieros', sector: 'industrial' },
  GGAL: { name: 'Grupo Financiero Galicia — Información financiera', url: 'https://www.gfgsa.com/es/informacion-financiera', sector: 'bank' },
  BMA: { name: 'Banco Macro — Relaciones con inversores', url: 'https://www.macro.com.ar/relaciones-inversores/home', sector: 'bank' },
  PAMP: { name: 'Pampa Energía — Informes trimestrales', url: 'https://ri.pampa.com/informacion-financiera/informes-de-resultados-trimestrales/', sector: 'industrial' },
  TECO2: { name: 'Telecom Argentina — Balances trimestrales', url: 'https://inversores.personal.com.ar/es/balances-trimestrales.html', sector: 'industrial' },
  TGSU2: { name: 'TGS — Inversores', url: 'https://www.tgs.com.ar/inversores/', sector: 'industrial' },
  YPFD: { name: 'YPF — Presentaciones', url: 'https://inversores.ypf.com/presentaciones.html', sector: 'industrial' }
};

export const getBalanceSource = (ticker) => BALANCE_SOURCES[String(ticker || '').toUpperCase()] || null;
