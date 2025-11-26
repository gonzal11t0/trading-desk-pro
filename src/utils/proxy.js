// src/utils/proxy.js
export const createProxyUrl = (url) => {
    return `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
};

export const localProxy = (url) => `/api/proxy?url=${encodeURIComponent(url)}`;