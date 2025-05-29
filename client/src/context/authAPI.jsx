import axios from 'axios';

const api = axios.create({
  baseURL: 'https://utkarshgupta-1.onrender.com/api',
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use((config) => {
  const authData = JSON.parse(localStorage.getItem('auth'));
  if (authData?.token) {
    config.headers.Authorization = `Bearer ${authData.token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const { data } = await api.post('/auth/refresh');
        const authData = {
          token: data.token,
          expiry: Date.now() + (7 * 24 * 60 * 60 * 1000)
        };
        localStorage.setItem('auth', JSON.stringify(authData));
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('auth');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },
  refreshToken: async () => {
    const { data } = await api.post('/auth/refresh');
    return data;
  },
  logout: async () => {
    await api.post('/auth/logout');
  }
};

export default api;