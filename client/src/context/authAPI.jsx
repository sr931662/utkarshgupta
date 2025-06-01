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
    try {
      const { data } = await api.get('/auth/me');
      // Ensure consistent response structure
      return {
        success: true,
        user: data.user || data.data?.user || data,
        token: data.token
      };
    } catch (error) {
      console.error('GetMe error:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch user profile'
      );
    }
  },
  // getMe: async () => {
  //   const { data } = await api.get('/auth/me');
  //   return data;
  // },
  updateProfile: async (url, userData) => {
    try {
      // Handle file upload if profileImage is a base64 string
      if (userData.profileImage && userData.profileImage.startsWith('data:image')) {
        const formData = new FormData();
        Object.keys(userData).forEach(key => {
          if (key === 'profileImage') {
            // Convert base64 to Blob
            const blob = dataURLtoBlob(userData.profileImage);
            formData.append('profileImage', blob, 'profile.jpg');
          } else if (typeof userData[key] === 'object') {
            formData.append(key, JSON.stringify(userData[key]));
          } else {
            formData.append(key, userData[key]);
          }
        });

        const response = await api.put(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      }

      // Regular JSON update
      const response = await api.put(url, userData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to update profile'
      );
    }
  },
  refreshToken: async () => {
    const { data } = await api.post('/auth/refresh');
    return data;
  },
  logout: async () => {
    await api.post('/auth/logout');
  }
};
function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
export default api;