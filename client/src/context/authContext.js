// src/context/authContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authSuccess, setAuthSuccess] = useState(null);
  const navigate = useNavigate();

  // Check auth status on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      if (isTokenValid(token)) {
        const decoded = jwtDecode(token);
        setUser(decoded);
        setIsAuthenticated(true);
        setAuthToken(token); // Set for axios requests
      } else {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const { data } = await axios.post('https://utkarshgupta-1.onrender.com/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      setAuthToken(data.token);
      const decoded = jwtDecode(data.token);
      setUser(decoded);
      setIsAuthenticated(true);
      return data;
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    setAuthError(null);
    setAuthSuccess(null);
    try {
      await axios.post('https://utkarshgupta-1.onrender.com/api/auth/forgotPassword', { email });
      setAuthSuccess('Password reset link sent to your email!');
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    setLoading(true);
    setAuthError(null);
    try {
      const { data } = await axios.patch(`https://utkarshgupta-1.onrender.com/api/auth/resetPassword/${token}`, { password: newPassword });
      setAuthSuccess('Password reset successfully! You can now login with your new password.');
      return data;
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Password reset failed. The link may have expired.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Helper to set auth token for axios
  const setAuthToken = (token) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  // Check if token is expired
  const isTokenValid = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch (err) {
      return false;
    }
  };

  const clearMessages = () => {
    setAuthError(null);
    setAuthSuccess(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading,
      authError,
      authSuccess,
      login, 
      logout,
      forgotPassword,
      resetPassword,
      clearMessages,
      setAuthError,
      setAuthSuccess
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);