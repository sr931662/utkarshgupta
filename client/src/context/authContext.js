import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const authData = JSON.parse(localStorage.getItem('auth'));
        
        if (authData?.token && authData?.expiry > Date.now()) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${authData.token}`;
          const { data } = await axios.get('http://localhost:5000/api/auth/me');
          setToken(authData.token);
          setUser(data.user);
        }
      } catch (err) {
        localStorage.removeItem('auth');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (token, userData) => {
    const authData = {
      token: token,
      expiry: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    };
    localStorage.setItem('auth', JSON.stringify(authData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setToken(token);
    setUser(userData);
    navigate('/admin/dashboard');
  };

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