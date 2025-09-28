import React, { useState, useEffect } from 'react';
import './Notification.css';

const Notification = ({ message, type = 'success', onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(), 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${type} ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="notification-content">
        <div className="notification-icon">
          {type === 'success' && '✓'}
          {type === 'error' && '✗'}
          {type === 'info' && 'ℹ'}
        </div>
        <span className="notification-message">{message}</span>
        <button className="notification-close" onClick={() => setIsVisible(false)}>
          ×
        </button>
      </div>
    </div>
  );
};

export default Notification;
