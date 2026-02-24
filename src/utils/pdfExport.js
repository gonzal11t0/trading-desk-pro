// src/utils/pdfExport.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportarEmpresaPDF = (empresa) => {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(18);
  doc.text(`${empresa.ticker} - Análisis Financiero`, 14, 22);
  
  // Fecha
  doc.setFontSize(10);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-AR')}`, 14, 30);
  
  // Datos básicos
  doc.setFontSize(12);
  doc.text(`Último balance: ${empresa.ultimoBalance}`, 14, 40);
  
  // Tabla de indicadores - CORREGIDO
  autoTable(doc, {
    startY: 50,
    head: [['Indicador', 'Valor', 'Variación', 'Vs Industria']],
    body: [
      ['Ingresos', empresa.ingresos, `${empresa.varIngresos > 0 ? '+' : ''}${empresa.varIngresos}%`, '+28%'],
      ['EBITDA', empresa.ebitda, `${empresa.varEbitda > 0 ? '+' : ''}${empresa.varEbitda}%`, '+25%'],
      ['Deuda', empresa.deuda, `${empresa.varDeuda > 0 ? '+' : ''}${empresa.varDeuda}%`, '+12%'],
      ['PER', empresa.per, `${empresa.varPer > 0 ? '+' : ''}${empresa.varPer}%`, '9.5x'],
      ['ROE', empresa.roe || '18%', `${empresa.varRoe ? (empresa.varRoe > 0 ? '+' : '') + empresa.varRoe + '%' : '+3%'}`, '15%'],
      ['Deb/EBITDA', empresa.deudaEbitda || '4.8x', '', '']
    ],
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] }
  });
  
  // Análisis
  const finalY = doc.lastAutoTable?.finalY || 150;
  doc.setFontSize(14);
  doc.text('Análisis', 14, finalY + 10);
  doc.setFontSize(10);
  
  // Dividir el análisis en líneas
  const analisisLines = doc.splitTextToSize(empresa.analisis, 180);
  doc.text(analisisLines, 14, finalY + 18);
  
  // Guardar
  doc.save(`${empresa.ticker}_analisis.pdf`);
};

export const exportarBonoPDF = (bono) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text(`${bono.ticker} - ${bono.nombre}`, 14, 22);
  doc.setFontSize(10);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-AR')}`, 14, 30);
  
  autoTable(doc, {
    startY: 40,
    head: [['Concepto', 'Valor']],
    body: [
      ['Tipo', bono.tipo],
      ['Precio', `$${bono.precio.toFixed(2)}`],
      ['Variación', `${bono.varPrecio > 0 ? '+' : ''}${bono.varPrecio}%`],
      ['TIR', `${bono.tir}%`],
      ['Duración', `${bono.duracion} años`],
      ['Cupón', `${bono.cupon}%`],
      ['Vencimiento', new Date(bono.fechaVencimiento).toLocaleDateString('es-AR')]
    ],
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] }
  });
  
  const finalY = doc.lastAutoTable?.finalY || 150;
  doc.setFontSize(14);
  doc.text('Análisis', 14, finalY + 10);
  doc.setFontSize(10);
  doc.text(doc.splitTextToSize(bono.analisis, 180), 14, finalY + 18);
  
  doc.save(`${bono.ticker}_analisis.pdf`);
};

export const exportarLetraPDF = (letra) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text(`${letra.ticker} - ${letra.nombre}`, 14, 22);
  doc.setFontSize(10);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-AR')}`, 14, 30);
  
  autoTable(doc, {
    startY: 40,
    head: [['Concepto', 'Valor']],
    body: [
      ['Tipo', letra.tipo],
      ['Precio', `$${letra.precio.toFixed(2)}`],
      ['Variación', `${letra.varPrecio > 0 ? '+' : ''}${letra.varPrecio}%`],
      ['TNA', `${letra.tna}%`],
      ['TEA', `${letra.tea}%`],
      ['Plazo', `${letra.plazo} días`],
      ['Vencimiento', new Date(letra.vencimiento).toLocaleDateString('es-AR')]
    ],
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] }
  });
  
  const finalY = doc.lastAutoTable?.finalY || 150;
  doc.setFontSize(14);
  doc.text('Análisis', 14, finalY + 10);
  doc.setFontSize(10);
  doc.text(doc.splitTextToSize(letra.analisis, 180), 14, finalY + 18);
  
  doc.save(`${letra.ticker}_analisis.pdf`);
};