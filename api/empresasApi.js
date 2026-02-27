// src/api/empresasApi.js
const API_URL = 'http://localhost:3001/api';

export const empresasApi = {
  getCompanyData: async (ticker) => {
    try {
      const response = await fetch(`${API_URL}/company/${ticker}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('✅ Datos recibidos:', data);
      return data;
    } catch (error) {
      console.error('Error en empresasApi:', error);
      throw error;
    }
  }
};