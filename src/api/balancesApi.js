import { API_URL } from '../config/runtime';

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Error HTTP ${response.status}`);
  return data;
};

export const balancesApi = {
  getBalances: async () => parseResponse(await fetch(`${API_URL}/balances`)),

  saveBalance: async ({ balance, sourceFilename, sourceUrl }) => {
    const token = localStorage.getItem('tdp_token');
    return parseResponse(await fetch(`${API_URL}/admin/balances`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ balance, sourceFilename, sourceUrl })
    }));
  },

  getAdminBalances: async () => parseResponse(await fetch(`${API_URL}/admin/balances`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('tdp_token')}` }
  })),

  restoreBalance: async (ticker, versionId) => parseResponse(await fetch(`${API_URL}/admin/balances/${ticker}/versions/${versionId}/restore`, {
    method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('tdp_token')}` }
  })),

  withdrawBalance: async ticker => parseResponse(await fetch(`${API_URL}/admin/balances/${ticker}`, {
    method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('tdp_token')}` }
  })),

  extractBalance: async ({ file, ticker, sourceUrl }) => {
    const token = localStorage.getItem('tdp_token');
    if (file.size > 4_400_000) {
      if (!sourceUrl) throw new Error('El PDF es demasiado grande y falta el enlace oficial para analizarlo desde la fuente.');
      return parseResponse(await fetch(`${API_URL}/admin/balances/extract`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ticker, sourceUrl })
      }));
    }
    return parseResponse(await fetch(`${API_URL}/admin/balances/extract?ticker=${encodeURIComponent(ticker)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/pdf'
      },
      body: file
    }));
  }
};
