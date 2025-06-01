import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from './authAPI';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Add this function
  const updateUser = (updatedUserData) => {
    setUser(prev => ({ ...prev, ...updatedUserData }));
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
  const authData = JSON.parse(localStorage.getItem('auth'));
  const isTokenValid = authData?.token && authData?.expiry > Date.now();

  if (!isTokenValid) {
    localStorage.removeItem('auth');
    setLoading(false);
    return;
  }

  try {
    setToken(authData.token);
    const response = await authAPI.getMe();
    setUser(response.user || response.data?.user || response);
  } catch (err) {
    console.error("Failed to fetch user:", err);
    localStorage.removeItem('auth');
  } finally {
    setLoading(false);
  }
};
    // const initializeAuth = async () => {
    //   const authData = JSON.parse(localStorage.getItem('auth'));
    //   const isTokenValid = authData?.token && authData?.expiry > Date.now();

    //   if (!isTokenValid) {
    //     localStorage.removeItem('auth');
    //     setLoading(false);
    //     return;
    //   }

    //   try {
    //     setToken(authData.token);
    //     const { user } = await authAPI.getMe(); // only call if token is valid
    //     setUser(user);
    //   } catch (err) {
    //     console.error("Failed to fetch user:", err);
    //     localStorage.removeItem('auth');
    //   } finally {
    //     setLoading(false);
    //   }
    // };


    initializeAuth();
  }, []);
// In your login function:
const login = async (token, userData) => {
  const authData = {
    token: token,
    expiry: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
  };
  localStorage.setItem('auth', JSON.stringify(authData));
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  setToken(token);
  setUser(userData.user || userData); // Handle both response structures
  navigate('/admin/dashboard');
};
  // const login = async (token, userData) => {
  //   const authData = {
  //     token: token,
  //     expiry: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
  //   };
  //   localStorage.setItem('auth', JSON.stringify(authData));
  //   axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  //   setToken(token);
  //   setUser(userData);
  //   navigate('/admin/dashboard');
  // };

  const logout = () => {
    localStorage.removeItem('auth');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    token,
    loading,
    login,
    updateUser, // Make sure this is included
    logout,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'superadmin' || user?.role === 'manager'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}