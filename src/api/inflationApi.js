// src/api/inflationApi.js
const ARGENSTATS_API_KEY = 'as_prod_ZVEVYAdpAPGIhYexnSMZVjURoQJGtb1H';

export const inflationApi = {
  getLastMonthsInflation: async (months = 12) => {
    return getMockHistoricalData(months);
  }
};

function getMockHistoricalData(months = 12) {
  const realData = [
    { date: "2026-02-02", value: 2.9 },
    { date: "2026-02-01", value: 2.9 },
    { date: "2025-12-03", value: 2.8 },  
    { date: "2025-11-03", value: 2.5 },  
    { date: "2025-10-03", value: 2.3 },  
    { date: "2025-09-03", value: 2.1 },  
    { date: "2025-08-03", value: 1.9 },  



  ];
  
  return realData.slice(0, months).map((item, index, arr) => {
    let monthlyChange = null;
    if (index < arr.length - 1) {
      const current = item.value;
      const prev = arr[index + 1].value;
      const change = ((current - prev) / prev) * 100;
      monthlyChange = change > 0 ? `+${change.toFixed(1)}` : change.toFixed(1);
    }
    
    return {
      date: item.date,
      values: { monthly: item.value, yearly: null, accumulated: null },
      change: { monthly: monthlyChange, yearly: null, accumulated: null }
    };
  });
}

export default inflationApi;