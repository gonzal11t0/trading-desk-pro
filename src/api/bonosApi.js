import { API_URL } from '../config/runtime';

export const bonosApi = {
  async getBonos() {
    const response = await fetch(`${API_URL}/bonos`, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`La API de bonos respondió HTTP ${response.status}`);
    const payload = await response.json();
    if (Array.isArray(payload)) return payload;
    if (payload.success && Array.isArray(payload.data)) return payload.data;
    throw new Error('La API de bonos devolvió un formato inválido');
  }
};
