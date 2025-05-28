import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/authContext';
import { motion } from 'framer-motion';
import styles from './profileSettings.module.css';
import { FiUser, FiMail, FiLock, FiGlobe, FiSave, FiEdit, FiCamera } from 'react-icons/fi';

const ProfileSettings = () => {
  const { darkMode } = useTheme();
  const { user, updateUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || 'Researcher in Computer Science',
    institution: user?.institution || 'University of Example',
    location: user?.location || 'New York, USA',
    website: user?.website || 'https://example.com',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [activeTab, setActiveTab] = useState('profile');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(formData);
    setEditMode(false);
    // Here you would typically call an API to update the user data
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Validate passwords match and call API to change password
    if (passwordData.newPassword === passwordData.confirmPassword) {
      // API call to change password
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  };

  return (
    <div className={`${styles.tabContent} ${darkMode ? styles.dark : ''}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={styles.profileContainer}
      >
        <div className={styles.profileHeader}>
          <h2>Profile Settings</h2>
          {!editMode ? (
            <motion.button
              className={`${styles.editButton} ${darkMode ? styles.dark : ''}`}
              onClick={() => setEditMode(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiEdit size={16} /> Edit Profile
            </motion.button>
          ) : (
            <div className={styles.editActions}>
              <motion.button
                className={`${styles.cancelButton} ${darkMode ? styles.dark : ''}`}
                onClick={() => setEditMode(false)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                className={`${styles.saveButton} ${darkMode ? styles.dark : ''}`}
                onClick={handleSubmit}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiSave size={16} /> Save Changes
              </motion.button>
            </div>
          )}
        </div>

        <div className={styles.profileGrid}>
          {/* Profile Info Section */}
          <motion.div 
            className={styles.profileCard}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className={styles.avatarSection}>
              <div className={styles.avatarContainer}>
                <div className={styles.userAvatarLarge}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                {editMode && (
                  <motion.label
                    className={styles.avatarEdit}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiCamera size={18} />
                    <input type="file" accept="image/*" style={{ display: 'none' }} />
                  </motion.label>
                )}
              </div>
              {!editMode && (
                <div className={styles.profileInfo}>
                  <h3>{formData.name}</h3>
                  <p>{formData.institution}</p>
                  <p className={styles.bio}>{formData.bio}</p>
                </div>
              )}
            </div>

            {editMode && (
              <form onSubmit={handleSubmit} className={styles.profileForm}>
                <div className={styles.formGroup}>
                  <label>
                    <FiUser size={16} /> Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>
                    <FiMail size={16} /> Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>
                    <FiUser size={16} /> Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Institution</label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>
                    <FiGlobe size={16} /> Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                  />
                </div>
              </form>
            )}
          </motion.div>

          {/* Password Change Section */}
          <motion.div 
            className={styles.profileCard}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3>Change Password</h3>
            <form onSubmit={handlePasswordSubmit} className={styles.passwordForm}>
              <div className={styles.formGroup}>
                <label>
                  <FiLock size={16} /> Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <FiLock size={16} /> New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <FiLock size={16} /> Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <motion.button
                type="submit"
                className={`${styles.saveButton} ${darkMode ? styles.dark : ''}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                disabled={
                  !passwordData.currentPassword ||
                  !passwordData.newPassword ||
                  passwordData.newPassword !== passwordData.confirmPassword
                }
              >
                Update Password
              </motion.button>
            </form>
          </motion.div>

          {/* Account Preferences Section */}
          <motion.div 
            className={styles.profileCard}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3>Account Preferences</h3>
            <div className={styles.preferenceItem}>
              <label>Email Notifications</label>
              <select defaultValue="weekly" disabled={!editMode}>
                <option value="instant">Instant</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="none">None</option>
              </select>
            </div>

            <div className={styles.preferenceItem}>
              <label>Default Dashboard View</label>
              <select defaultValue="overview" disabled={!editMode}>
                <option value="overview">Overview</option>
                <option value="publications">Publications</option>
                <option value="analytics">Analytics</option>
              </select>
            </div>

            <div className={styles.preferenceItem}>
              <label>Theme Preference</label>
              <select defaultValue={darkMode ? 'dark' : 'light'} disabled={!editMode}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </div>
          </motion.div>

          {/* Danger Zone Section */}
          <motion.div 
            className={`${styles.profileCard} ${styles.dangerZone}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3>Danger Zone</h3>
            <div className={styles.dangerItem}>
              <p>Deactivate your account temporarily</p>
              <button className={styles.warningButton}>Deactivate Account</button>
            </div>
            <div className={styles.dangerItem}>
              <p>Permanently delete your account and all data</p>
              <button className={styles.dangerButton}>Delete Account</button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileSettings;