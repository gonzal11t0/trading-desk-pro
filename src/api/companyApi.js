import { API_URL } from '../config/runtime';

export const companyApi = {
  async getCompany(ticker) {
    const response = await fetch(`${API_URL}/company/${encodeURIComponent(ticker)}`, {
      signal: AbortSignal.timeout(15000)
    });
    if (!response.ok) throw new Error(`La API de empresas respondió HTTP ${response.status}`);
    return response.json();
  }
};
