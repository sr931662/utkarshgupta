import React from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ size = 'medium', color = 'primary' }) => {
  const sizeClasses = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large
  };

  const colorClasses = {
    primary: styles.primary,
    secondary: styles.secondary,
    light: styles.light,
    dark: styles.dark
  };

  return (
    <div className={`${styles.spinnerContainer} ${sizeClasses[size]} ${colorClasses[color]}`}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default LoadingSpinner;