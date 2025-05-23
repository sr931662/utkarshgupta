import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './Login.module.css';
import authAPI from '../../context/authAPI'; // Import the authAPI

const Login = () => {
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState('');
  const { 
    loading, 
    setAuthError, 
    setAuthSuccess,
    clearMessages
  } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };

  const handleForgotPasswordChange = (e) => {
    setForgotPasswordEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    setErrors('');
    setSuccessMessage('');
    
    try {
      const data = await authAPI.login(loginForm.email, loginForm.password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setAuthSuccess('Login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      setErrors(error.message || 'Login failed');
      setAuthError(error.message || 'Login failed');
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    setErrors('');
    
    try {
      await authAPI.forgotPassword(forgotPasswordEmail);
      setSuccessMessage('Password reset link sent to your email!');
      setAuthSuccess('Password reset link sent to your email!');
      setForgotPasswordEmail('');
      setShowForgotPassword(false);
    } catch (error) {
      setErrors(error.message || 'Failed to send reset link');
      setAuthError(error.message || 'Failed to send reset link');
    }
  };

  return (
    <div className={`${styles.loginContainer} ${darkMode ? styles.dark : ''}`}>
      {!showForgotPassword ? (
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <h1>Admin Login</h1>
          
          {errors && (
            <div className={styles.error}>
              {errors}
            </div>
          )}
          
          {successMessage && (
            <div className={styles.success}>
              {successMessage}
            </div>
          )}
          
          <input 
            type="email" 
            name="email"
            placeholder="Admin Email" 
            value={loginForm.email}
            onChange={handleChange}
            required
            className={styles.inputField}
          />
          
          <input 
            type="password" 
            name="password"
            placeholder="Password" 
            value={loginForm.password}
            onChange={handleChange}
            required
            minLength="8"
            className={styles.inputField}
          />
          
          <button 
            type="submit" 
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className={styles.forgotPasswordLink}>
            <button 
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className={styles.linkButton}
            >
              Forgot Password?
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleForgotPasswordSubmit} className={styles.loginForm}>
          <h1>Reset Password</h1>
          
          {errors && (
            <div className={styles.error}>
              {errors}
            </div>
          )}
          
          <p className={styles.instructions}>
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          <input 
            type="email" 
            placeholder="Your Email" 
            value={forgotPasswordEmail}
            onChange={handleForgotPasswordChange}
            required
            className={styles.inputField}
          />
          
          <div className={styles.buttonGroup}>
            <button 
              type="submit" 
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            
            <button 
              type="button"
              onClick={() => {
                setShowForgotPassword(false);
                setErrors('');
                clearMessages();
              }}
              className={styles.cancelButton}
            >
              Back to Login
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;