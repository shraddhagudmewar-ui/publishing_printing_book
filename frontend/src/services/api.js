import axios from 'axios';

// Base Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for injecting auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ka_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: return entire response object so res.data and status are preserved
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'An unexpected communication error occurred.';

    // If unauthorized, clear invalid token
    if (error.response?.status === 401) {
      localStorage.removeItem('ka_auth_token');
      localStorage.removeItem('ka_auth_user');
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
