import React from 'react';

const Header = ({ currentMode, isDarkMode }) => {
  return (
    <div className={`flex items-center justify-between px-8 py-5 border-b sticky top-0 z-10 shadow-sm backdrop-filter backdrop-blur-xl transition-colors duration-300 ${
      isDarkMode
        ? 'border-gray-800 bg-gray-900/80'
        : 'border-gray-200 bg-white/80'
    }`}>
      <h2 className={`text-xl font-bold tracking-tight ${
        isDarkMode
          ? 'bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent'
          : 'bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'
      }`}>{currentMode}</h2>
    </div>
  );
};

export default Header;
