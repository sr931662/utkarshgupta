import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/authContext';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './dashboard.module.css';

// Icons
import {
  FiUpload, FiUser,
  FiBell, FiSearch, FiChevronLeft, FiChevronRight,
} from 'react-icons/fi';

import UploadPublications from './Publishings/uploadPubs';
import ProfileSettings from './profileSettings/profileSettings';

const Dashboard = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();

  // Set default to profile
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const navItems = [
    { id: 'upload', label: 'Upload Content', icon: <FiUpload size={20} /> },
    { id: 'profile', label: 'Profile', icon: <FiUser size={20} /> },
  ];

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (notificationCount > 0) setNotificationCount(0);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'upload':
        return <div className={styles.tabContent}><UploadPublications /></div>;
      case 'profile':
        return <div className={styles.tabContent}><ProfileSettings /></div>;
      default:
        return <div className={styles.tabContent}>Select an option</div>;
    }
  };

  return (
    <div
      className={`${styles.dashboard} 
      ${darkMode ? styles.dark : ''} 
      ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}
    >
      {/* Sidebar */}
      <motion.aside
        className={styles.sidebar}
        animate={{ width: sidebarCollapsed ? 80 : 'auto' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className={styles.sidebarHeader}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={styles.userDetails}
              >
                <h3 className={styles.userName}>{user?.name || 'Admin'}</h3>
                <p className={styles.userEmail}>{user?.email || 'admin@example.com'}</p>
              </motion.div>
            )}
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          <ul>
            {navItems.map((item) => (
              <motion.li
                key={item.id}
                className={`${styles.navItem} ${darkMode ? styles.dark : ''} ${activeTab === item.id ? styles.active : ''}`}
                onClick={() => setActiveTab(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {!sidebarCollapsed && <span className={styles.navLabel}>{item.label}</span>}
              </motion.li>
            ))}
          </ul>
        </nav>

        <button className={styles.collapseButton} onClick={toggleSidebar}>
          {sidebarCollapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
        </button>
      </motion.aside>

      {/* Main Content */}
      <main className={`${styles.mainContent} ${darkMode ? styles.dark : ''}`}>
        <header className={styles.topBar}>
          <h1 className={styles.pageTitle}>
            {activeTab === 'upload' ? 'Upload Content' : 'Profile'}
          </h1>
          <div className={styles.actions}>
            {/* Notifications */}
            <div className={styles.notificationWrapper}>
              <motion.button
                className={styles.actionButton}
                onClick={handleNotificationClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiBell size={20} />
                {notificationCount > 0 && (
                  <motion.span
                    className={styles.notificationBadge}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    key={notificationCount}
                  >
                    {notificationCount}
                  </motion.span>
                )}
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    className={styles.notificationDropdown}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    <h3>Notifications</h3>
                    <ul>
                      <li>New publication submitted</li>
                      <li>System update available</li>
                      <li>3 new messages</li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search */}
            <motion.button
              className={styles.actionButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiSearch size={18} /> {!sidebarCollapsed && 'Search'}
            </motion.button>
          </div>
        </header>

        <div className={styles.contentGrid}>{renderContent()}</div>
      </main>
    </div>
  );
};

export default Dashboard;
