import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './Login.module.css';
import axios from 'axios';

const Login = () => {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [errors, setErrors] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const clearMessages = () => {
    setErrors('');
    setSuccessMessage('');
  };

  const handleChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();

    try {
      const response = await axios.post('https://utkarshgupta-1.onrender.com/api/auth/login', loginForm);
      authLogin(response.data.token, response.data.data.user);

      const welcomeMessage = response.data.data.user.role === 'superadmin'
        ? 'Welcome Super Admin!'
        : 'Welcome Admin!';
      setSuccessMessage(`${welcomeMessage} Redirecting...`);

      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setErrors(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();

    try {
      await axios.post('https://utkarshgupta-1.onrender.com/api/auth/send-otp', {
        email: forgotPasswordEmail,
      });
      setOtpSent(true);
      setSuccessMessage('OTP has been sent to your email.');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to send OTP.';
      setErrors(message);
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();

    if (newPassword !== confirmPassword) {
      setErrors('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      await axios.post('https://utkarshgupta-1.onrender.com/api/auth/verify-otp-reset', {
        email: forgotPasswordEmail,
        otp,
        newPassword
      });

      setSuccessMessage('Password reset successful! You can now log in.');
      setTimeout(resetForgotPasswordFlow, 2000);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to reset password.';
      setErrors(message);
    } finally {
      setLoading(false);
    }
  };

  const resetForgotPasswordFlow = () => {
    setShowForgotPassword(false);
    setOtpSent(false);
    setShowPasswordFields(false);
    setForgotPasswordEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    clearMessages();
  };

  return (
    <div className={`${styles.loginContainer} ${darkMode ? styles.dark : ''}`}>
      {!showForgotPassword ? (
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <h1>Admin Portal</h1>
          <p className={styles.subtitle}>Sign in to your account</p>

          {errors && <div className={styles.error}><i className="fas fa-exclamation-circle"></i> {errors}</div>}
          {successMessage && <div className={styles.success}><i className="fas fa-check-circle"></i> {successMessage}</div>}

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={loginForm.email}
              onChange={handleChange}
              required
              className={styles.inputField}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={loginForm.password}
              onChange={handleChange}
              required
              minLength="8"
              className={styles.inputField}
            />
          </div>

          <button type="submit" disabled={loading} className={`${styles.submitButton} ${loading ? styles.loading : ''}`}>
            {loading ? <><i className="fas fa-spinner fa-spin"></i> Signing In...</> : 'Sign In'}
          </button>

          <div className={styles.forgotPasswordLink}>
            <button type="button" onClick={() => { setShowForgotPassword(true); clearMessages(); }} className={styles.linkButton}>
              Forgot your password?
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className={styles.loginForm}>
          <h1>Reset Password</h1>
          <p className={styles.subtitle}>Enter the details to reset your password</p>

          {errors && <div className={styles.error}><i className="fas fa-exclamation-circle"></i> {errors}</div>}
          {successMessage && <div className={styles.success}><i className="fas fa-check-circle"></i> {successMessage}</div>}

          {!otpSent && (
            <div className={styles.inputGroup}>
              <label htmlFor="forgotEmail">Email</label>
              <input
                type="email"
                id="forgotEmail"
                placeholder="Enter your registered email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                required
                className={styles.inputField}
              />
            </div>
          )}

          {otpSent && (
            <>
              <div className={styles.inputGroup}>
                <label htmlFor="otp">OTP</label>
                <input
                  type="text"
                  id="otp"
                  placeholder="Enter the 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className={styles.inputField}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength="8"
                  className={styles.inputField}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength="8"
                  className={styles.inputField}
                />
              </div>
            </>
          )}

          <div className={styles.buttonGroup}>
            {!otpSent ? (
              <button type="button" onClick={handleSendOTP} disabled={loading} className={`${styles.submitButton} ${loading ? styles.loading : ''}`}>
                {loading ? <><i className="fas fa-spinner fa-spin"></i> Sending...</> : 'Send OTP'}
              </button>
            ) : (
              <button type="submit" disabled={loading} className={`${styles.submitButton} ${loading ? styles.loading : ''}`}>
                {loading ? <><i className="fas fa-spinner fa-spin"></i> Resetting...</> : 'Reset Password'}
              </button>
            )}

            <button type="button" onClick={resetForgotPasswordFlow} className={styles.cancelButton}>
              Back to Login
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;


































// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/authContext';
// import { useTheme } from '../../context/ThemeContext';
// import styles from './Login.module.css';
// import axios from 'axios';
// import emailjs from '@emailjs/browser';

// // Initialize EmailJS
// emailjs.init(process.env.EMAILJS_PUBLIC_KEY);

// const Login = () => {
//   const [loginForm, setLoginForm] = useState({
//     email: '',
//     password: '',
//   });
//   const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [showPasswordFields, setShowPasswordFields] = useState(false);
//   const [errors, setErrors] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { darkMode } = useTheme();
//   const navigate = useNavigate();
//   const { login: authLogin } = useAuth();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setLoginForm({
//       ...loginForm,
//       [name]: value,
//     });
//   };

//   const handleForgotPasswordChange = (e) => {
//     setForgotPasswordEmail(e.target.value);
//   };

//   const clearMessages = () => {
//     setErrors('');
//     setSuccessMessage('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     clearMessages();

//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/login', loginForm);
      
//       authLogin(response.data.token, response.data.data.user);
      
//       const welcomeMessage = response.data.data.user.role === 'superadmin' 
//         ? 'Welcome Super Admin!' 
//         : 'Welcome Admin!';
      
//       setSuccessMessage(`${welcomeMessage} Redirecting...`);
      
//       setTimeout(() => {
//         navigate('/admin/dashboard');
//       }, 1500);
//     } catch (err) {
//       let errorMessage = 'Login failed. Please check your credentials and try again.';
      
//       if (err.response) {
//         if (err.response.status === 401) {
//           errorMessage = 'Invalid email or password';
//         } else if (err.response.status === 403) {
//           errorMessage = 'Account not approved. Please contact superadmin.';
//         } else if (err.response.data?.message) {
//           errorMessage = err.response.data.message;
//         }
//       }
      
//       setErrors(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSendOTP = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     clearMessages();

//     try {
//       await axios.post('http://localhost:5000/api/otp/send-otp', {
//         email: forgotPasswordEmail
//       });

//       setOtpSent(true);
//       setSuccessMessage('OTP has been sent to your email!');
//     } catch (err) {
//       let errorMessage = 'Failed to send OTP. Please try again.';
      
//       if (err.response) {
//         console.log(err)
//         if (err.response.status === 404) {
//           errorMessage = err.response.data.message;
//         } else if (err.response.data?.message) {
//           errorMessage = err.response.data.message;
//         }
//       }
      
//       setErrors(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOTP = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     clearMessages();

//     try {
//       // First verify OTP
//       const verifyResponse = await axios.post('http://localhost:5000/api/otp/verify-otp-reset', {
//         email: forgotPasswordEmail,
//         otp
//       });

//       if (verifyResponse.data.valid) {
//         setShowPasswordFields(true);
//         setSuccessMessage('OTP verified. Please enter your new password.');
//       } else {
//         throw new Error('Invalid or expired OTP');
//       }
//     } catch (err) {
//       setErrors(err.response?.data?.message || 'Invalid OTP. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     clearMessages();

//     try {
//       if (newPassword !== confirmPassword) {
//         throw new Error('Passwords do not match');
//       }

//       await axios.post('http://localhost:5000/api/otp/reset-password-with-otp', {
//         email: forgotPasswordEmail,
//         otp,
//         newPassword
//       });

//       setSuccessMessage('Password reset successfully! You can now login with your new password.');
//       setTimeout(() => {
//         setShowForgotPassword(false);
//         setOtpSent(false);
//         setShowPasswordFields(false);
//         setForgotPasswordEmail('');
//         setOtp('');
//         setNewPassword('');
//         setConfirmPassword('');
//       }, 2000);
//     } catch (err) {
//       setErrors(err.response?.data?.message || 'Failed to reset password. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForgotPasswordFlow = () => {
//     setShowForgotPassword(false);
//     setOtpSent(false);
//     setShowPasswordFields(false);
//     setForgotPasswordEmail('');
//     setOtp('');
//     setNewPassword('');
//     setConfirmPassword('');
//     clearMessages();
//   };

//   return (
//     <div className={`${styles.loginContainer} ${darkMode ? styles.dark : ''}`}>
//       {!showForgotPassword ? (
//         <form onSubmit={handleSubmit} className={styles.loginForm}>
//           <h1>Admin Portal</h1>
//           <p className={styles.subtitle}>Sign in to your account</p>
          
//           {errors && (
//             <div className={styles.error}>
//               <i className="fas fa-exclamation-circle"></i> {errors}
//             </div>
//           )}
          
//           {successMessage && (
//             <div className={styles.success}>
//               <i className="fas fa-check-circle"></i> {successMessage}
//             </div>
//           )}
          
//           <div className={styles.inputGroup}>
//             <label htmlFor="email">Email</label>
//             <input 
//               type="email" 
//               id="email"
//               name="email"
//               placeholder="Enter your email" 
//               value={loginForm.email}
//               onChange={handleChange}
//               required
//               className={styles.inputField}
//             />
//           </div>
          
//           <div className={styles.inputGroup}>
//             <label htmlFor="password">Password</label>
//             <input 
//               type="password" 
//               id="password"
//               name="password"
//               placeholder="Enter your password" 
//               value={loginForm.password}
//               onChange={handleChange}
//               required
//               minLength="8"
//               className={styles.inputField}
//             />
//           </div>
          
//           <button 
//             type="submit" 
//             disabled={loading}
//             className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
//           >
//             {loading ? (
//               <>
//                 <i className="fas fa-spinner fa-spin"></i> Signing In...
//               </>
//             ) : (
//               'Sign In'
//             )}
//           </button>

//           <div className={styles.forgotPasswordLink}>
//             <button 
//               type="button"
//               onClick={() => {
//                 setShowForgotPassword(true);
//                 clearMessages();
//               }}
//               className={styles.linkButton}
//             >
//               Forgot your password?
//             </button>
//           </div>
//         </form>
//       ) : (
//         <form 
//           onSubmit={
//             showPasswordFields ? handleResetPassword : 
//             otpSent ? handleVerifyOTP : 
//             handleSendOTP
//           } 
//           className={styles.loginForm}
//         >
//           <h1>Reset Password</h1>
//           <p className={styles.subtitle}>
//             {showPasswordFields ? 'Enter your new password' : 
//              otpSent ? 'Enter the OTP sent to your email' : 
//              'Enter your email to receive an OTP'}
//           </p>
          
//           {errors && (
//             <div className={styles.error}>
//               <i className="fas fa-exclamation-circle"></i> {errors}
//             </div>
//           )}
          
//           {successMessage && (
//             <div className={styles.success}>
//               <i className="fas fa-check-circle"></i> {successMessage}
//             </div>
//           )}
          
//           {!otpSent ? (
//             <div className={styles.inputGroup}>
//               <label htmlFor="forgotEmail">Email</label>
//               <input 
//                 type="email" 
//                 id="forgotEmail"
//                 placeholder="Enter your registered email" 
//                 value={forgotPasswordEmail}
//                 onChange={handleForgotPasswordChange}
//                 required
//                 className={styles.inputField}
//               />
//             </div>
//           ) : !showPasswordFields ? (
//             <div className={styles.inputGroup}>
//               <label htmlFor="otp">OTP Code</label>
//               <input 
//                 type="text" 
//                 id="otp"
//                 placeholder="Enter 6-digit OTP" 
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 required
//                 maxLength="6"
//                 className={styles.inputField}
//               />
//             </div>
//           ) : (
//             <>
//               <div className={styles.inputGroup}>
//                 <label htmlFor="newPassword">New Password</label>
//                 <input 
//                   type="password" 
//                   id="newPassword"
//                   placeholder="Enter new password" 
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   required
//                   minLength="8"
//                   className={styles.inputField}
//                 />
//               </div>
//               <div className={styles.inputGroup}>
//                 <label htmlFor="confirmPassword">Confirm Password</label>
//                 <input 
//                   type="password" 
//                   id="confirmPassword"
//                   placeholder="Confirm new password" 
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   required
//                   minLength="8"
//                   className={styles.inputField}
//                 />
//               </div>
//             </>
//           )}
          
//           <div className={styles.buttonGroup}>
//             <button 
//               type="submit" 
//               disabled={loading}
//               className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
//             >
//               {loading ? (
//                 <>
//                   <i className="fas fa-spinner fa-spin"></i> Processing...
//                 </>
//               ) : showPasswordFields ? (
//                 'Reset Password'
//               ) : otpSent ? (
//                 'Verify OTP'
//               ) : (
//                 'Send OTP'
//               )}
//             </button>
            
//             <button 
//               type="button"
//               onClick={resetForgotPasswordFlow}
//               className={styles.cancelButton}
//             >
//               Back to Login
//             </button>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// };

// export default Login;







































// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { useAuth } from '../../context/authContext';
// // import { useTheme } from '../../context/ThemeContext';
// // import styles from './Login.module.css';
// // import axios from 'axios';
// // import emailjs from '@emailjs/browser';

// // // Initialize EmailJS (should be done once in your app)
// // emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);

// // const Login = () => {
// //   const [loginForm, setLoginForm] = useState({
// //     email: '',
// //     password: '',
// //   });
// //   const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
// //   const [showForgotPassword, setShowForgotPassword] = useState(false);
// //   const [errors, setErrors] = useState('');
// //   const [successMessage, setSuccessMessage] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const { darkMode } = useTheme();
// //   const navigate = useNavigate();
// //   const { login: authLogin } = useAuth();

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setLoginForm({
// //       ...loginForm,
// //       [name]: value,
// //     });
// //   };

// //   const handleForgotPasswordChange = (e) => {
// //     setForgotPasswordEmail(e.target.value);
// //   };

// //   const clearMessages = () => {
// //     setErrors('');
// //     setSuccessMessage('');
// //   };

// //   const generateOTP = () => {
// //     return Math.floor(100000 + Math.random() * 900000).toString();
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     clearMessages();

// //     try {
// //       const response = await axios.post('http://localhost:5000/api/auth/login', loginForm);
      
// //       authLogin(response.data.token, response.data.data.user);
      
// //       const welcomeMessage = response.data.data.user.role === 'superadmin' 
// //         ? 'Welcome Super Admin!' 
// //         : 'Welcome Admin!';
      
// //       setSuccessMessage(`${welcomeMessage} Redirecting...`);
      
// //       setTimeout(() => {
// //         navigate('/admin/dashboard');
// //       }, 1500);
// //     } catch (err) {
// //       let errorMessage = 'Login failed. Please check your credentials and try again.';
      
// //       if (err.response) {
// //         if (err.response.status === 401) {
// //           errorMessage = 'Invalid email or password';
// //         } else if (err.response.status === 403) {
// //           errorMessage = 'Account not approved. Please contact superadmin.';
// //         } else if (err.response.data?.message) {
// //           errorMessage = err.response.data.message;
// //         }
// //       }
      
// //       setErrors(errorMessage);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// // const handleForgotPasswordSubmit = async (e) => {
// //   e.preventDefault();
// //   setLoading(true);
// //   clearMessages();

// //   try {
// //     // First check if email exists
// //     const checkResponse = await axios.post('http://localhost:5000/api/auth/check-email', {
// //       email: forgotPasswordEmail
// //     });

// //     if (!checkResponse.data.exists) {
// //       throw new Error('No account found with that email address.');
// //     }

// //     // Generate OTP
// //     const otp = generateOTP();

// //     // Send OTP via EmailJS
// //     await emailjs.send(
// //       process.env.EMAILJS_SERVICE_ID,
// //       process.env.EMAILJS_TEMPLATE_ID,
// //       {
// //         to_email: forgotPasswordEmail,
// //         otp_code: otp,
// //         expiration: "10 minutes"
// //       }
// //     );

// //     // Save OTP to backend (optional but recommended)
// //     await axios.post('http://localhost:5000/api/auth/forgotPassword', {
// //       email: forgotPasswordEmail,
// //       otp
// //     });

// //     setSuccessMessage(`OTP sent to ${forgotPasswordEmail}! Please check your inbox.`);
// //     setForgotPasswordEmail('');
// //     setShowForgotPassword(false);
// //   } catch (err) {
// //     let errorMessage = 'Failed to send OTP. Please try again.';
    
// //     if (err.response) {
// //       if (err.response.status === 404 || err.response.data?.exists === false) {
// //         errorMessage = 'No account found with that email address.';
// //       } else if (err.response.data?.message) {
// //         errorMessage = err.response.data.message;
// //       }
// //     } else if (err.message) {
// //       errorMessage = err.message;
// //     }
    
// //     setErrors(errorMessage);
// //   } finally {
// //     setLoading(false);
// //   }
// // };

// //   return (
// //     <div className={`${styles.loginContainer} ${darkMode ? styles.dark : ''}`}>
// //       {!showForgotPassword ? (
// //         <form onSubmit={handleSubmit} className={styles.loginForm}>
// //           <h1>Admin Portal</h1>
// //           <p className={styles.subtitle}>Sign in to your account</p>
          
// //           {errors && (
// //             <div className={styles.error}>
// //               <i className="fas fa-exclamation-circle"></i> {errors}
// //             </div>
// //           )}
          
// //           {successMessage && (
// //             <div className={styles.success}>
// //               <i className="fas fa-check-circle"></i> {successMessage}
// //             </div>
// //           )}
          
// //           <div className={styles.inputGroup}>
// //             <label htmlFor="email">Email</label>
// //             <input 
// //               type="email" 
// //               id="email"
// //               name="email"
// //               placeholder="Enter your email" 
// //               value={loginForm.email}
// //               onChange={handleChange}
// //               required
// //               className={styles.inputField}
// //             />
// //           </div>
          
// //           <div className={styles.inputGroup}>
// //             <label htmlFor="password">Password</label>
// //             <input 
// //               type="password" 
// //               id="password"
// //               name="password"
// //               placeholder="Enter your password" 
// //               value={loginForm.password}
// //               onChange={handleChange}
// //               required
// //               minLength="8"
// //               className={styles.inputField}
// //             />
// //           </div>
          
// //           <button 
// //             type="submit" 
// //             disabled={loading}
// //             className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
// //           >
// //             {loading ? (
// //               <>
// //                 <i className="fas fa-spinner fa-spin"></i> Signing In...
// //               </>
// //             ) : (
// //               'Sign In'
// //             )}
// //           </button>

// //           <div className={styles.forgotPasswordLink}>
// //             <button 
// //               type="button"
// //               onClick={() => {
// //                 setShowForgotPassword(true);
// //                 clearMessages();
// //               }}
// //               className={styles.linkButton}
// //             >
// //               Forgot your password?
// //             </button>
// //           </div>
// //         </form>
// //       ) : (
// //         <form onSubmit={handleForgotPasswordSubmit} className={styles.loginForm}>
// //           <h1>Reset Password</h1>
// //           <p className={styles.subtitle}>We'll send you an OTP to verify your identity</p>
          
// //           {errors && (
// //             <div className={styles.error}>
// //               <i className="fas fa-exclamation-circle"></i> {errors}
// //             </div>
// //           )}
          
// //           {successMessage && (
// //             <div className={styles.success}>
// //               <i className="fas fa-check-circle"></i> {successMessage}
// //             </div>
// //           )}
          
// //           <div className={styles.inputGroup}>
// //             <label htmlFor="forgotEmail">Email</label>
// //             <input 
// //               type="email" 
// //               id="forgotEmail"
// //               placeholder="Enter your registered email" 
// //               value={forgotPasswordEmail}
// //               onChange={handleForgotPasswordChange}
// //               required
// //               className={styles.inputField}
// //             />
// //           </div>
          
// //           <div className={styles.buttonGroup}>
// //             <button 
// //               type="submit" 
// //               disabled={loading}
// //               className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
// //             >
// //               {loading ? (
// //                 <>
// //                   <i className="fas fa-spinner fa-spin"></i> Sending OTP...
// //                 </>
// //               ) : (
// //                 'Send OTP'
// //               )}
// //             </button>
            
// //             <button 
// //               type="button"
// //               onClick={() => {
// //                 setShowForgotPassword(false);
// //                 clearMessages();
// //               }}
// //               className={styles.cancelButton}
// //             >
// //               Back to Login
// //             </button>
// //           </div>
// //         </form>
// //       )}
// //     </div>
// //   );
// // };

// // export default Login;











// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { useAuth } from '../../context/authContext';
// // import { useTheme } from '../../context/ThemeContext';
// // import styles from './Login.module.css';
// // import axios from 'axios';
// // import { sendPasswordResetOTP } from "./OTPVerify/emailService";


// // const Login = () => {
// //   const [loginForm, setLoginForm] = useState({
// //     email: '',
// //     password: '',
// //   });
// //   const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
// //   const [showForgotPassword, setShowForgotPassword] = useState(false);
// //   const [errors, setErrors] = useState('');
// //   const [successMessage, setSuccessMessage] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const { darkMode } = useTheme();
// //   const navigate = useNavigate();
// //   const { login: authLogin } = useAuth();

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setLoginForm({
// //       ...loginForm,
// //       [name]: value,
// //     });
// //   };

// //   const handleForgotPasswordChange = (e) => {
// //     setForgotPasswordEmail(e.target.value);
// //   };

// //   const clearMessages = () => {
// //     setErrors('');
// //     setSuccessMessage('');
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     clearMessages();

// //     try {
// //       const response = await axios.post('http://localhost:5000/api/auth/login', loginForm);
      
// //       // Store token and user data in auth context
// //       authLogin(response.data.token, response.data.data.user);
      
// //       // Update success message based on user role
// //       const welcomeMessage = response.data.data.user.role === 'superadmin' 
// //         ? 'Welcome Super Admin!' 
// //         : 'Welcome Admin!';
      
// //       setSuccessMessage(`${welcomeMessage} Redirecting...`);
      
// //       // Redirect based on role
// //       setTimeout(() => {
// //         navigate('/admin/dashboard');
// //       }, 1500);
// //     } catch (err) {
// //       let errorMessage = 'Login failed. Please check your credentials and try again.';
      
// //       if (err.response) {
// //         if (err.response.status === 401) {
// //           errorMessage = 'Invalid email or password';
// //         } else if (err.response.status === 403) {
// //           errorMessage = 'Account not approved. Please contact superadmin.';
// //         } else if (err.response.data?.message) {
// //           errorMessage = err.response.data.message;
// //         }
// //       }
      
// //       setErrors(errorMessage);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleForgotPasswordSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     clearMessages();

// //     try {
// //       await axios.post('http://localhost:5000/api/auth/forgotPassword', {
// //         email: forgotPasswordEmail,
// //       });
      
// //       setSuccessMessage('Password reset link sent to your email! Please check your inbox (and spam folder).');
// //       setForgotPasswordEmail('');
// //       setShowForgotPassword(false);
// //     } catch (err) {
// //       let errorMessage = 'Failed to send reset link. Please try again.';
      
// //       if (err.response) {
// //         if (err.response.status === 404) {
// //           errorMessage = 'No account found with that email address.';
// //         } else if (err.response.data?.message) {
// //           errorMessage = err.response.data.message;
// //         }
// //       }
      
// //       setErrors(errorMessage);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className={`${styles.loginContainer} ${darkMode ? styles.dark : ''}`}>
// //       {!showForgotPassword ? (
// //         <form onSubmit={handleSubmit} className={styles.loginForm}>
// //           <h1>Admin Portal</h1>
// //           <p className={styles.subtitle}>Sign in to your account</p>
          
// //           {errors && (
// //             <div className={styles.error}>
// //               <i className="fas fa-exclamation-circle"></i> {errors}
// //             </div>
// //           )}
          
// //           {successMessage && (
// //             <div className={styles.success}>
// //               <i className="fas fa-check-circle"></i> {successMessage}
// //             </div>
// //           )}
          
// //           <div className={styles.inputGroup}>
// //             <label htmlFor="email">Email</label>
// //             <input 
// //               type="email" 
// //               id="email"
// //               name="email"
// //               placeholder="Enter your email" 
// //               value={loginForm.email}
// //               onChange={handleChange}
// //               required
// //               className={styles.inputField}
// //             />
// //           </div>
          
// //           <div className={styles.inputGroup}>
// //             <label htmlFor="password">Password</label>
// //             <input 
// //               type="password" 
// //               id="password"
// //               name="password"
// //               placeholder="Enter your password" 
// //               value={loginForm.password}
// //               onChange={handleChange}
// //               required
// //               minLength="8"
// //               className={styles.inputField}
// //             />
// //           </div>
          
// //           <button 
// //             type="submit" 
// //             disabled={loading}
// //             className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
// //           >
// //             {loading ? (
// //               <>
// //                 <i className="fas fa-spinner fa-spin"></i> Signing In...
// //               </>
// //             ) : (
// //               'Sign In'
// //             )}
// //           </button>

// //           <div className={styles.forgotPasswordLink}>
// //             <button 
// //               type="button"
// //               onClick={() => {
// //                 setShowForgotPassword(true);
// //                 clearMessages();
// //               }}
// //               className={styles.linkButton}
// //             >
// //               Forgot your password?
// //             </button>
// //           </div>
// //         </form>
// //       ) : (
// //         <form onSubmit={handleForgotPasswordSubmit} className={styles.loginForm}>
// //           <h1>Reset Password</h1>
// //           <p className={styles.subtitle}>We'll send you a reset link</p>
          
// //           {errors && (
// //             <div className={styles.error}>
// //               <i className="fas fa-exclamation-circle"></i> {errors}
// //             </div>
// //           )}
          
// //           {successMessage && (
// //             <div className={styles.success}>
// //               <i className="fas fa-check-circle"></i> {successMessage}
// //             </div>
// //           )}
          
// //           <div className={styles.inputGroup}>
// //             <label htmlFor="forgotEmail">Email</label>
// //             <input 
// //               type="email" 
// //               id="forgotEmail"
// //               placeholder="Enter your registered email" 
// //               value={forgotPasswordEmail}
// //               onChange={handleForgotPasswordChange}
// //               required
// //               className={styles.inputField}
// //             />
// //           </div>
          
// //           <div className={styles.buttonGroup}>
// //             <button 
// //               type="submit" 
// //               disabled={loading}
// //               className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
// //             >
// //               {loading ? (
// //                 <>
// //                   <i className="fas fa-spinner fa-spin"></i> Sending...
// //                 </>
// //               ) : (
// //                 'Send Reset Link'
// //               )}
// //             </button>
            
// //             <button 
// //               type="button"
// //               onClick={() => {
// //                 setShowForgotPassword(false);
// //                 clearMessages();
// //               }}
// //               className={styles.cancelButton}
// //             >
// //               Back to Login
// //             </button>
// //           </div>
// //         </form>
// //       )}
// //     </div>
// //   );
// // };

// // export default Login;
































// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { useAuth } from '../../context/authContext';
// // import { useTheme } from '../../context/ThemeContext';
// // import styles from './Login.module.css';
// // import axios from 'axios';

// // const Login = () => {
// //   const [loginForm, setLoginForm] = useState({
// //     email: '',
// //     password: '',
// //   });
// //   const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
// //   const [showForgotPassword, setShowForgotPassword] = useState(false);
// //   const [errors, setErrors] = useState('');
// //   const [successMessage, setSuccessMessage] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const { darkMode } = useTheme();
// //   const navigate = useNavigate();
// //   const { login: authLogin } = useAuth();

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setLoginForm({
// //       ...loginForm,
// //       [name]: value,
// //     });
// //   };

// //   const handleForgotPasswordChange = (e) => {
// //     setForgotPasswordEmail(e.target.value);
// //   };

// //   const clearMessages = () => {
// //     setErrors('');
// //     setSuccessMessage('');
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     clearMessages();

// //     try {
// //       // const response = await axios.post('https://utkarshgupta-1.onrender.com/api/auth/login', loginForm);
// //       const response = await axios.post('http://localhost:5000/api/auth/login', loginForm);
      
// //       // Call the auth context login function
// //       authLogin(response.data.token, response.data.data.user);
      
// //       setSuccessMessage('Login successful! Redirecting...');
// //       setTimeout(() => {
// //         navigate('/admin/dashboard');
// //       }, 1500);
// //     } catch (err) {
// //       setErrors(
// //         err.response?.data?.message || 
// //         'Login failed. Please check your credentials and try again.'
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleForgotPasswordSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     clearMessages();

// //     try {
// //       await axios.post('/api/auth/forgotPassword', {
// //         email: forgotPasswordEmail,
// //       });
      
// //       setSuccessMessage('Password reset link sent to your email!');
// //       setForgotPasswordEmail('');
// //     } catch (err) {
// //       setErrors(
// //         err.response?.data?.message || 
// //         'Failed to send reset link. Please try again.'
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className={`${styles.loginContainer} ${darkMode ? styles.dark : ''}`}>
// //       {!showForgotPassword ? (
// //         <form onSubmit={handleSubmit} className={styles.loginForm}>
// //           <h1>Admin Login</h1>
          
// //           {errors && (
// //             <div className={styles.error}>
// //               {errors}
// //             </div>
// //           )}
          
// //           {successMessage && (
// //             <div className={styles.success}>
// //               {successMessage}
// //             </div>
// //           )}
          
// //           <input 
// //             type="email" 
// //             name="email"
// //             placeholder="Admin Email" 
// //             value={loginForm.email}
// //             onChange={handleChange}
// //             required
// //             className={styles.inputField}
// //           />
          
// //           <input 
// //             type="password" 
// //             name="password"
// //             placeholder="Password" 
// //             value={loginForm.password}
// //             onChange={handleChange}
// //             required
// //             minLength="8"
// //             className={styles.inputField}
// //           />
          
// //           <button 
// //             type="submit" 
// //             disabled={loading}
// //             className={styles.submitButton}
// //           >
// //             {loading ? 'Signing In...' : 'Sign In'}
// //           </button>

// //           <div className={styles.forgotPasswordLink}>
// //             <button 
// //               type="button"
// //               onClick={() => setShowForgotPassword(true)}
// //               className={styles.linkButton}
// //             >
// //               Forgot Password?
// //             </button>
// //           </div>
// //         </form>
// //       ) : (
// //         <form onSubmit={handleForgotPasswordSubmit} className={styles.loginForm}>
// //           <h1>Reset Password</h1>
          
// //           {errors && (
// //             <div className={styles.error}>
// //               {errors}
// //             </div>
// //           )}
          
// //           {successMessage && (
// //             <div className={styles.success}>
// //               {successMessage}
// //             </div>
// //           )}
          
// //           <p className={styles.instructions}>
// //             Enter your email address and we'll send you a link to reset your password.
// //           </p>
          
// //           <input 
// //             type="email" 
// //             placeholder="Your Email" 
// //             value={forgotPasswordEmail}
// //             onChange={handleForgotPasswordChange}
// //             required
// //             className={styles.inputField}
// //           />
          
// //           <div className={styles.buttonGroup}>
// //             <button 
// //               type="submit" 
// //               disabled={loading}
// //               className={styles.submitButton}
// //             >
// //               {loading ? 'Sending...' : 'Send Reset Link'}
// //             </button>
            
// //             <button 
// //               type="button"
// //               onClick={() => {
// //                 setShowForgotPassword(false);
// //                 setErrors('');
// //                 clearMessages();
// //               }}
// //               className={styles.cancelButton}
// //             >
// //               Back to Login
// //             </button>
// //           </div>
// //         </form>
// //       )}
// //     </div>
// //   );
// // };

// // export default Login;


























// // // import React, { useState } from 'react';
// // // import { useNavigate } from 'react-router-dom';
// // // import { useAuth } from '../../context/authContext';
// // // import { useTheme } from '../../context/ThemeContext';
// // // import styles from './Login.module.css';
// // // import authAPI from '../../context/authAPI'; // Import the authAPI

// // // const Login = () => {
// // //   const [loginForm, setLoginForm] = useState({
// // //     email: '',
// // //     password: ''
// // //   });
// // //   const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
// // //   const [showForgotPassword, setShowForgotPassword] = useState(false);
// // //   const [successMessage, setSuccessMessage] = useState('');
// // //   const [errors, setErrors] = useState('');
// // //   const { 
// // //     loading, 
// // //     setAuthError, 
// // //     setAuthSuccess,
// // //     clearMessages
// // //   } = useAuth();
// // //   const { darkMode } = useTheme();
// // //   const navigate = useNavigate();

// // //   const handleChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setLoginForm(prev => ({ ...prev, [name]: value }));
// // //   };

// // //   const handleForgotPasswordChange = (e) => {
// // //     setForgotPasswordEmail(e.target.value);
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     clearMessages();
// // //     setErrors('');
// // //     setSuccessMessage('');
    
// // //     try {
// // //       const data = await authAPI.login({
// // //         email: loginForm.email,
// // //         pass: loginForm.password  // Change from password to pass
// // //       });
// // //       localStorage.setItem('token', data.token);
// // //       localStorage.setItem('user', JSON.stringify(data.user));
// // //       setAuthSuccess('Login successful!');
// // //       navigate('/admin/dashboard');
// // //     } catch (error) {
// // //       setErrors(error.message || 'Login failed');
// // //       setAuthError(error.message || 'Login failed');
// // //     }
// // //   };

// // //   const handleForgotPasswordSubmit = async (e) => {
// // //     e.preventDefault();
// // //     clearMessages();
// // //     setErrors('');
    
// // //     try {
// // //       await authAPI.forgotPassword(forgotPasswordEmail);
// // //       setSuccessMessage('Password reset link sent to your email!');
// // //       setAuthSuccess('Password reset link sent to your email!');
// // //       setForgotPasswordEmail('');
// // //       setShowForgotPassword(false);
// // //     } catch (error) {
// // //       setErrors(error.message || 'Failed to send reset link');
// // //       setAuthError(error.message || 'Failed to send reset link');
// // //     }
// // //   };

// // //   return (
// // //     <div className={`${styles.loginContainer} ${darkMode ? styles.dark : ''}`}>
// // //       {!showForgotPassword ? (
// // //         <form onSubmit={handleSubmit} className={styles.loginForm}>
// // //           <h1>Admin Login</h1>
          
// // //           {errors && (
// // //             <div className={styles.error}>
// // //               {errors}
// // //             </div>
// // //           )}
          
// // //           {successMessage && (
// // //             <div className={styles.success}>
// // //               {successMessage}
// // //             </div>
// // //           )}
          
// // //           <input 
// // //             type="email" 
// // //             name="email"
// // //             placeholder="Admin Email" 
// // //             value={loginForm.email}
// // //             onChange={handleChange}
// // //             required
// // //             className={styles.inputField}
// // //           />
          
// // //           <input 
// // //             type="password" 
// // //             name="password"
// // //             placeholder="Password" 
// // //             value={loginForm.password}
// // //             onChange={handleChange}
// // //             required
// // //             minLength="8"
// // //             className={styles.inputField}
// // //           />
          
// // //           <button 
// // //             type="submit" 
// // //             disabled={loading}
// // //             className={styles.submitButton}
// // //           >
// // //             {loading ? 'Signing In...' : 'Sign In'}
// // //           </button>

// // //           <div className={styles.forgotPasswordLink}>
// // //             <button 
// // //               type="button"
// // //               onClick={() => setShowForgotPassword(true)}
// // //               className={styles.linkButton}
// // //             >
// // //               Forgot Password?
// // //             </button>
// // //           </div>
// // //         </form>
// // //       ) : (
// // //         <form onSubmit={handleForgotPasswordSubmit} className={styles.loginForm}>
// // //           <h1>Reset Password</h1>
          
// // //           {errors && (
// // //             <div className={styles.error}>
// // //               {errors}
// // //             </div>
// // //           )}
          
// // //           <p className={styles.instructions}>
// // //             Enter your email address and we'll send you a link to reset your password.
// // //           </p>
          
// // //           <input 
// // //             type="email" 
// // //             placeholder="Your Email" 
// // //             value={forgotPasswordEmail}
// // //             onChange={handleForgotPasswordChange}
// // //             required
// // //             className={styles.inputField}
// // //           />
          
// // //           <div className={styles.buttonGroup}>
// // //             <button 
// // //               type="submit" 
// // //               disabled={loading}
// // //               className={styles.submitButton}
// // //             >
// // //               {loading ? 'Sending...' : 'Send Reset Link'}
// // //             </button>
            
// // //             <button 
// // //               type="button"
// // //               onClick={() => {
// // //                 setShowForgotPassword(false);
// // //                 setErrors('');
// // //                 clearMessages();
// // //               }}
// // //               className={styles.cancelButton}
// // //             >
// // //               Back to Login
// // //             </button>
// // //           </div>
// // //         </form>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default Login;