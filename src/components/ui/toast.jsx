import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'default', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  if (!visible) return null;
  
  const typeClasses = {
    default: 'bg-white border border-gray-200',
    success: 'bg-green-100 border border-green-200 text-green-800',
    error: 'bg-red-100 border border-red-200 text-red-800',
    warning: 'bg-yellow-100 border border-yellow-200 text-yellow-800',
    info: 'bg-blue-100 border border-blue-200 text-blue-800'
  };
  
  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg transition-opacity duration-300 ${typeClasses[type]}`}>
      <div className="flex items-center">
        <span className="text-sm font-medium">{message}</span>
        <button 
          onClick={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
          className="ml-4 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export { Toast };