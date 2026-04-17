import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-gradient-to-r from-espresso-700 to-espresso-800 border-caramel-400',
    warning: 'bg-gradient-to-r from-caramel-500 to-caramel-600 border-caramel-300',
    error: 'bg-gradient-to-r from-latte-600 to-latte-700 border-latte-400'
  };

  const textStyles = {
    success: 'text-cream-50',
    warning: 'text-cream-50',
    error: 'text-cream-50'
  };

  const icons = {
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };

  return (
    <div className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl font-bold shadow-xl border-2 transition-all animate-bounce-in ${styles[type]}`}>
      <span className={`text-xl ${textStyles[type]}`}>{icons[type]}</span>
      <span className={`text-sm ${textStyles[type]}`}>{message}</span>
      <button
        onClick={onClose}
        className={`ml-4 opacity-60 hover:opacity-100 transition-opacity ${textStyles[type]}`}
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;
