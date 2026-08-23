import { API_URL } from '../config/runtime';

export const letrasApi = {
  async getLetras() {
    const response = await fetch(`${API_URL}/letras`, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`La API de letras respondió HTTP ${response.status}`);
    const payload = await response.json();
    if (Array.isArray(payload)) return payload;
    if (payload.success && Array.isArray(payload.data)) return payload.data;
    throw new Error('La API de letras devolvió un formato inválido');
  }
};
