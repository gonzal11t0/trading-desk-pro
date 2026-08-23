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

  extractBalance: async ({ file, ticker }) => {
    if (file.size > 3_100_000) throw new Error('El PDF supera 3 MB. Descargá una versión reducida o sólo los estados financieros principales.');
    const pdfBase64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(',')[1]);
      reader.onerror = () => reject(new Error('No fue posible leer el PDF'));
      reader.readAsDataURL(file);
    });
    const token = localStorage.getItem('tdp_token');
    return parseResponse(await fetch(`${API_URL}/admin/balances/extract`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ticker, pdfBase64 })
    }));
  }
};
