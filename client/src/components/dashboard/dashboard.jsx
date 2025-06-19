import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/authContext';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './dashboard.module.css';

// Icons
import { 
  FiUpload, FiUser, 
  FiBell, FiSearch, FiChevronLeft, FiChevronRight,
  FiFileText, FiTrendingUp, FiUsers, FiHardDrive
} from 'react-icons/fi';
import UploadPublications from './Publishings/uploadPubs';
import ProfileSettings from './profileSettings/profileSettings';

const Dashboard = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const navItems = [
    { id: 'upload', label: 'Upload Content', icon: <FiUpload size={20} /> },
    { id: 'profile', label: 'Profile', icon: <FiUser size={20} /> },
  ];

  const stats = [
    { id: 1, label: 'Total Publications', value: 24, icon: <FiFileText size={24} />, change: '↑ 12% from last month' },
    { id: 2, label: 'Pending Reviews', value: 5, icon: <FiFileText size={24} />, change: '↓ 2 from yesterday' },
    { id: 3, label: 'Active Users', value: 143, icon: <FiUsers size={24} />, change: '↑ 8% from last week' },
    { id: 4, label: 'Storage Used', value: 45, icon: <FiHardDrive size={24} />, change: '', isPercentage: true }
  ];

  const activities = [
    { id: 1, icon: <FiFileText size={18} />, text: 'New publication added', time: '2 hours ago' },
    { id: 2, icon: <FiTrendingUp size={18} />, text: '3 new citations received', time: '5 hours ago' },
    { id: 3, icon: <FiUser size={18} />, text: 'Profile information updated', time: 'Yesterday' }
  ];

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (notificationCount > 0) {
      setNotificationCount(0);
    }
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
          return "Default";
    }
  };

  // const renderDashboardContent = () => (
  //   <>
  //     {/* Stats Cards */}
  //     <div className={styles.statsGrid}>
  //       {stats.map((stat, index) => (
  //         <motion.div 
  //           key={stat.id}
  //           className={styles.statCard}
  //           initial={{ opacity: 0, y: 20 }}
  //           animate={{ opacity: 1, y: 0 }}
  //           transition={{ delay: index * 0.1 }}
  //         >
  //           {isLoading ? (
  //             <div className={styles.skeletonLoader} style={{ height: '2rem', width: '60%' }} />
  //           ) : (
  //             <>
  //               <div className={styles.statHeader}>
  //                 <div className={styles.statIcon}>{stat.icon}</div>
  //                 <h3>{stat.label}</h3>
  //               </div>
  //               <p className={styles.statValue}>{stat.value}{stat.isPercentage ? '%' : ''}</p>
  //               {stat.change && <p className={styles.statChange}>{stat.change}</p>}
  //               {stat.id === 4 && (
  //                 <div className={styles.progressBar}>
  //                   <motion.div 
  //                     className={styles.progressFill} 
  //                     initial={{ width: 0 }}
  //                     animate={{ width: `${stat.value}%` }}
  //                     transition={{ delay: 0.3, duration: 1 }}
  //                   />
  //                 </div>
  //               )}
  //             </>
  //           )}
  //         </motion.div>
  //       ))}
  //     </div>

  //     {/* Recent Activity */}
  //     <motion.div 
  //       className={styles.activityCard}
  //       initial={{ opacity: 0 }}
  //       animate={{ opacity: 1 }}
  //       transition={{ delay: 0.4 }}
  //     >
  //       <div className={styles.cardHeader}>
  //         <h2>Recent Activity</h2>
  //         <button className={styles.viewAll}>View All <FiChevronRight /></button>
  //       </div>
  //       {isLoading ? (
  //         <div className={styles.skeletonLoader} style={{ height: '200px' }} />
  //       ) : (
  //         <ul className={styles.activityList}>
  //           {activities.map((activity) => (
  //             <motion.li
  //               key={activity.id}
  //               initial={{ opacity: 0, x: -20 }}
  //               animate={{ opacity: 1, x: 0 }}
  //               transition={{ delay: 0.5 + activity.id * 0.1 }}
  //             >
  //               <span className={styles.activityIcon}>{activity.icon}</span>
  //               <div className={styles.activityContent}>
  //                 <p>{activity.text}</p>
  //                 <small>{activity.time}</small>
  //               </div>
  //             </motion.li>
  //           ))}
  //         </ul>
  //       )}
  //     </motion.div>

  //     {/* Content Overview */}
  //     <motion.div 
  //       className={styles.contentCard}
  //       initial={{ opacity: 0 }}
  //       animate={{ opacity: 1 }}
  //       transition={{ delay: 0.8 }}
  //     >
  //       <div className={styles.cardHeader}>
  //         <h2>Content Overview</h2>
  //         <select className={styles.timeFilter}>
  //           <option>Last 7 days</option>
  //           <option>Last 30 days</option>
  //           <option>Last 90 days</option>
  //         </select>
  //       </div>
  //       {isLoading ? (
  //         <div className={styles.skeletonLoader} style={{ height: '300px' }} />
  //       ) : (
  //         <div className={styles.chartPlaceholder}>
  //           <div className={styles.chartPlaceholderText}>
  //             Content Chart Visualization
  //           </div>
  //         </div>
  //       )}
  //     </motion.div>

  //     {/* Quick Actions */}
  //     <motion.div 
  //       className={styles.quickActions}
  //       initial={{ opacity: 0 }}
  //       animate={{ opacity: 1 }}
  //       transition={{ delay: 1 }}
  //     >
  //       <h2>Quick Actions</h2>
  //       {isLoading ? (
  //         <div className={styles.skeletonLoader} style={{ height: '100px' }} />
  //       ) : (
  //         <div className={styles.actionButtons}>
  //           <motion.button 
  //             className={styles.primaryAction}
  //             whileHover={{ scale: 1.03 }}
  //             whileTap={{ scale: 0.98 }}
  //             onClick={() => setActiveTab('upload')}
  //           >
  //             <FiUpload size={24} />
  //             <span>Upload New</span>
  //           </motion.button>
  //           <motion.button 
  //             whileHover={{ scale: 1.03 }}
  //             whileTap={{ scale: 0.98 }}
  //           >
  //             <FiFileText size={24} />
  //             <span>Create Draft</span>
  //           </motion.button>
  //           <motion.button 
  //             whileHover={{ scale: 1.03 }}
  //             whileTap={{ scale: 0.98 }}
  //           >
  //             <FiTrendingUp size={24} />
  //             <span>Generate Report</span>
  //           </motion.button>
  //         </div>
  //       )}
  //     </motion.div>
  //   </>
  // );

  return (
    <div className={`${styles.dashboard} ${darkMode ? styles.dark : ''} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
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
            {activeTab === 'dashboard' ? 'Dashboard Overview' : 
             activeTab === 'upload' ? 'Upload Content' :
             activeTab === 'manage' ? 'Manage Content' :
             activeTab === 'settings' ? 'Settings' : 'Profile'}
          </h1>
          <div className={styles.actions}>
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
            <motion.button 
              className={styles.actionButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiSearch size={18} /> {!sidebarCollapsed && 'Search'}
            </motion.button>
          </div>
        </header>

        <div className={styles.contentGrid}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;