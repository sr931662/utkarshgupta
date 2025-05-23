import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Create axios instance with base config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const authAPI = {
  // Register user
  async register(userData) {
    try {
      const response = await api.post('/register', userData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error ||
                         'Registration failed';
      throw new Error(errorMessage);
    }
  },
  async requestOTP(email) {
    try {
      const response = await api.post('/request-otp', { email });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         'Failed to request OTP';
      throw new Error(errorMessage);
    }
  },

  async verifyOTP(email, otp) {
    try {
      const response = await api.post('/verify-otp', { email, otp });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         'OTP verification failed';
      throw new Error(errorMessage);
    }
  },
  // Login user
  async login(email, password) {
    try {
      const response = await api.post('/login', {
        email,
        pass: password // Match backend field name
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error ||
                         'Login failed';
      throw new Error(errorMessage);
    }
  },

  // Logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get user profile
  async getProfile() {
    try {
      const response = await api.get('/profile');
      return response.data;
    } catch (error) {
      this.logout();
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error ||
                         'Failed to get profile';
      throw new Error(errorMessage);
    }
  },

  // Get auth headers
  getAuthHeader() {
    const token = localStorage.getItem('token');
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  }
};

export default authAPI;