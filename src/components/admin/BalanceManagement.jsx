import React, { useMemo, useState } from 'react';
import { Check, ExternalLink, FileText, Save, ShieldCheck } from 'lucide-react';
import balancesData from '../../data/balances_reales.json';
import { balancesApi } from '../../api/balancesApi';
import { getBalanceSource } from '../../data/balanceSources';

const emptyBalance = {
  ticker: '', nombre: '', ultimoBalance: '', periodo: '', moneda: 'ARS', precio: '',
  ingresos: '', varIngresos: '', ebitda: '', varEbitda: '', deuda: '', varDeuda: '',
  patrimonio: '', resultadoNeto: '', per: '', varPer: '', roe: '', varRoe: '',
  deudaEbitda: '', tendencia: '📈 estable', analisis: '', recomendacion: 'SIN RECOMENDACIÓN', sector: 'industrial'
};

const numberFields = [
  ['ingresos', 'Ingresos'], ['ebitda', 'EBITDA'], ['deuda', 'Deuda total'],
  ['patrimonio', 'Patrimonio'], ['resultadoNeto', 'Resultado neto'],
  ['varIngresos', 'Var. ingresos (%)'], ['varEbitda', 'Var. EBITDA (%)'],
  ['varDeuda', 'Var. deuda (%)'], ['per', 'PER'], ['varPer', 'Var. PER (%)']
];

const BalanceManagement = () => {
  const [balance, setBalance] = useState(emptyBalance);
  const [sourceFilename, setSourceFilename] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [message, setMessage] = useState(null);

  const calculated = useMemo(() => {
    const deuda = Number(balance.deuda);
    const ebitda = Number(balance.ebitda);
    const resultadoNeto = Number(balance.resultadoNeto);
    const patrimonio = Number(balance.patrimonio);
    return {
      deudaEbitda: Number.isFinite(deuda / ebitda) && ebitda !== 0 ? (deuda / ebitda).toFixed(2) : '—',
      roe: Number.isFinite(resultadoNeto / patrimonio) && patrimonio !== 0
        ? ((resultadoNeto / patrimonio) * 100).toFixed(2) : '—'
    };
  }, [balance]);
  const officialSource = getBalanceSource(balance.ticker);
  const isBank = officialSource?.sector === 'bank';

  const update = (field, value) => setBalance(current => ({ ...current, [field]: value }));

  const loadExisting = (ticker) => {
    const existing = balancesData.empresas.find(item => item.ticker === ticker);
    const source = getBalanceSource(ticker);
    const loaded = existing
      ? { ...emptyBalance, ...existing, resultadoNeto: existing.resultadoNeto ?? '', sector: source?.sector || 'industrial' }
      : { ...emptyBalance };
    if (source?.sector === 'bank') {
      loaded.ebitda = '';
      loaded.varEbitda = '';
      loaded.deuda = '';
      loaded.varDeuda = '';
      loaded.deudaEbitda = '';
    }
    setBalance(loaded);
    setSourceFilename('');
    setSourceUrl(getBalanceSource(ticker)?.url || '');
    setMessage(null);
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await balancesApi.saveBalance({ balance, sourceFilename, sourceUrl: sourceUrl || officialSource?.url || '' });
      setMessage({ type: 'success', text: `${balance.ticker} fue validado y publicado.` });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const extractPdf = async (file) => {
    setSourceFilename(file?.name || '');
    setMessage(null);
    if (!file) return;
    if (!balance.ticker) {
      setMessage({ type: 'error', text: 'Primero seleccioná una empresa o escribí el ticker.' });
      return;
    }
    setExtracting(true);
    try {
      const result = await balancesApi.extractBalance({ file, ticker: balance.ticker });
      setBalance(current => {
        const next = { ...current };
        Object.entries(result.fields || {}).forEach(([field, value]) => {
          if (value !== null && value !== '') next[field] = value;
        });
        return next;
      });
      const warning = result.warnings?.[0];
      setMessage({
        type: warning ? 'warning' : 'success',
        text: warning || `Se identificaron automáticamente ${result.found} valores. Revisalos antes de publicar.`
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setExtracting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-blue-800/40 bg-blue-950/20 p-4 text-sm text-gray-300">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-white">Carga controlada de balances</p>
            <p className="mt-1">Seleccioná el informe descargado desde la sección oficial de inversores de la empresa. El sistema identifica automáticamente las cifras principales, completa el formulario y espera tu revisión antes de publicar.</p>
            {officialSource ? (
              <a className="inline-flex items-center gap-1 mt-2 text-blue-400 hover:text-blue-300" href={officialSource.url} target="_blank" rel="noreferrer">
                Abrir {officialSource.name} <ExternalLink className="w-3 h-3" />
              </a>
            ) : <p className="mt-2 text-yellow-400">Seleccioná una empresa para abrir su fuente oficial.</p>}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <label className="text-sm text-gray-300">Empresa existente
          <select onChange={event => loadExisting(event.target.value)} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white">
            <option value="">Nueva empresa</option>
            {balancesData.empresas.map(item => <option key={item.ticker} value={item.ticker}>{item.ticker} — {item.nombre}</option>)}
          </select>
        </label>
        <label className="text-sm text-gray-300">Ticker
          <input value={balance.ticker} onChange={event => update('ticker', event.target.value.toUpperCase())} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white" />
        </label>
        <label className="text-sm text-gray-300">Empresa
          <input value={balance.nombre} onChange={event => update('nombre', event.target.value)} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white" />
        </label>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <label className="text-sm text-gray-300">Último balance
          <input placeholder="Jun 2026" value={balance.ultimoBalance} onChange={event => update('ultimoBalance', event.target.value)} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white" />
        </label>
        <label className="text-sm text-gray-300">Período
          <input placeholder="6M2026" value={balance.periodo} onChange={event => update('periodo', event.target.value)} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white" />
        </label>
        <label className="text-sm text-gray-300">Moneda y unidad
          <input placeholder="ARS millones" value={balance.moneda} onChange={event => update('moneda', event.target.value)} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white" />
        </label>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {numberFields.filter(([field]) => !isBank || !['ebitda', 'deuda', 'varEbitda', 'varDeuda'].includes(field)).map(([field, label]) => (
          <label key={field} className="text-sm text-gray-300">{label}
            <input type="number" step="any" value={balance[field]} onChange={event => update(field, event.target.value)} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white" />
          </label>
        ))}
      </div>

      <div className={`grid ${isBank ? 'md:grid-cols-1' : 'md:grid-cols-2'} gap-4 rounded-lg bg-gray-800/40 p-4`}>
        <p className="text-sm text-gray-300">ROE calculado: <strong className="text-white">{calculated.roe}%</strong></p>
        {!isBank && <p className="text-sm text-gray-300">Deuda / EBITDA: <strong className="text-white">{calculated.deudaEbitda}</strong></p>}
      </div>

      {isBank && <p className="text-xs text-blue-300">Para bancos no se utilizan EBITDA ni Deuda/EBITDA. El análisis se centra en resultado neto, patrimonio, ROE, ingresos operativos y PER.</p>}

      <p className="text-xs text-gray-500">El precio y el PER se consultan automáticamente al mercado en la pantalla Premium; no hace falta cargarlos desde el balance.</p>

      <label className="block text-sm text-gray-300">Comentario descriptivo
        <textarea rows="3" value={balance.analisis} onChange={event => update('analisis', event.target.value)} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white" />
      </label>

      <div className="grid md:grid-cols-2 gap-4">
        <label className="text-sm text-gray-300">PDF fuente
          <span className="mt-1 flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white">
            <FileText className="w-4 h-4 text-red-400" />
            <input type="file" accept="application/pdf" disabled={extracting} onChange={event => extractPdf(event.target.files?.[0])} className="w-full text-sm" />
          </span>
          {extracting && <span className="mt-1 block text-xs text-blue-400">Analizando el PDF…</span>}
        </label>
        <label className="text-sm text-gray-300">Enlace público del informe o presentación
          <input type="url" value={sourceUrl} onChange={event => setSourceUrl(event.target.value)} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white" />
        </label>
      </div>

      {message && <p className={`text-sm ${message.type === 'success' ? 'text-green-400' : message.type === 'warning' ? 'text-yellow-400' : 'text-red-400'}`}>{message.text}</p>}

      <button onClick={save} disabled={saving} className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg flex items-center justify-center gap-2">
        {saving ? <Save className="w-5 h-5 animate-pulse" /> : <Check className="w-5 h-5" />}
        {saving ? 'Guardando…' : 'Validar y publicar balance'}
      </button>
    </div>
  );
};

export default BalanceManagement;
