import axios from 'axios';

// Use a relative base URL and let Vite's dev server proxy /api to Django.
const api = axios.create({
  baseURL: '/api/',
});

// Add a request interceptor to attach the Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;