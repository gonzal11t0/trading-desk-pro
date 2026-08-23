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
  }
};
