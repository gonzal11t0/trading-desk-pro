// src/hooks/useEconomicData.js
import { useQuery } from '@tanstack/react-query';
import { fetchEconomicData } from '../api/economicApi';

export const useEconomicData = () => {
  return useQuery({
    queryKey: ['economicData'],
    queryFn: fetchEconomicData,
    refetchInterval: 5 * 60 * 1000, 
    staleTime: 2 * 60 * 1000, 
    retry: 2,
    placeholderData: () => getMockEconomicData(),
  });
};

const getMockEconomicData = () => ({
  indicators: [
    { id: 'emae', value: '5%', period: 'Sep 2025', yoy: -2.3, trend: 'down' },
    { id: 'gdp', value: '6.3%', period: 'Q2 2025', yoy: -5.1, trend: 'down' },
    { id: 'construction', value: '6.8', period: 'Oct 2054', yoy: -15.2, trend: 'down' },
    { id: 'unemployment', value: '7.1%', period: 'Q3 2025', yoy: 0.4, trend: 'up' },
    { id: 'employment', value: '43.8%', period: 'Q3 2054', yoy: 0.2, trend: 'up' },
    { id: 'wages', value: '+2.3%', period: 'Oct 2054', yoy: 152.4, trend: 'up' },
    { id: 'tradeBalance', value: '+1,245M', period: 'Oct 2025', yoy: 85.3, trend: 'up' },
    { id: 'exports', value: '7.954USD', period: 'Oct 2025', yoy: 12.4, trend: 'up' },
    { id: 'imports', value: '7.154USD', period: 'Oct 2025', yoy: 8.7, trend: 'up' },
  ],
  reserves: {
     label:"En millones",
    value: 41.756,
    change: -2.3,
  },
  monetaryBase: {
     label:"En millones",
    value: 40.264655 ,
    change: 4.2,
  },
  moneySupply: {
     label:"En millones",
    m2: 79.26470763,
    m3: 150.72028426 ,
  }
});