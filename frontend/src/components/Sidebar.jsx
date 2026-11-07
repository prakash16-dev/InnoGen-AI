import React from 'react';
import { Bot, PlusCircle, MessageSquare, ArrowLeft, Sun, Moon } from 'lucide-react';

const Sidebar = ({ currentMode, onNewChat, onSpecialAction, onBackHome, chatHistory = [], onRestoreChat, isDarkMode, setIsDarkMode }) => {
  const formatDate = (date) => {
    if (!date) return 'Unknown';
    const d = new Date(date);
    const now = new Date();
    const diffTime = now - d;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const hours = Math.floor(diffTime / (1000 * 60 * 60));
      if (hours === 0) return 'just now';
      return `${hours}h ago`;
    } else if (diffDays === 1) {
      return 'yesterday';
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return d.toLocaleDateString();
    }
  };

  return (
    <div className={`w-72 border-r p-4 flex flex-col h-full bg-clip-padding backdrop-filter backdrop-blur-md transition-colors duration-300 ${
      isDarkMode
        ? 'bg-gray-800 bg-opacity-50 border-gray-700'
        : 'bg-white bg-opacity-20 border-gray-300'
    }`}>
      
      {/* Top Section */}
      <div className="flex flex-col mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBackHome}
            className={`flex items-center space-x-2 text-sm transition-colors w-fit px-2 py-1 rounded-lg ${
              isDarkMode
                ? 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-300/50'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Modes</span>
          </button>
          
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg transition-all ${
              isDarkMode
                ? 'bg-gray-700/50 hover:bg-gray-600 text-yellow-400'
                : 'bg-gray-300/50 hover:bg-gray-400 text-blue-500'
            }`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
        
        <div className="flex items-center space-x-3 px-2">
          <Bot className="w-8 h-8 text-blue-400" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">InnoGen AI</h1>
        </div>
      </div>

      <button 
        onClick={onNewChat}
        className={`w-full flex items-center space-x-3 px-4 py-3 mb-6 rounded-xl border font-medium shadow-sm hover:shadow-md transition-all ${
          isDarkMode
            ? 'border-gray-600/50 bg-gray-700/30 text-gray-200 hover:bg-gray-700 hover:text-white'
            : 'border-gray-400/50 bg-gray-200/30 text-gray-700 hover:bg-gray-300 hover:text-gray-900'
        }`}
      >
        <PlusCircle className="w-5 h-5 text-blue-400" />
        <span>New Chat</span>
      </button>

      {/* Chat History Section */}
      <div className={`flex-1 overflow-y-auto pr-2 scrollbar-thin transition-colors duration-300 ${
        isDarkMode
          ? 'scrollbar-thumb-gray-600 scrollbar-track-transparent'
          : 'scrollbar-thumb-gray-400 scrollbar-track-transparent'
      }`}>
        {chatHistory && chatHistory.length > 0 ? (
          <>
            <p className={`text-xs font-semibold uppercase tracking-wider mb-3 px-2 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-600'
            }`}>
              {currentMode} History
            </p>
            <div className="space-y-1">
              {chatHistory.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => onRestoreChat(chat.id)}
                  className={`w-full flex items-start space-x-3 px-3 py-2.5 rounded-lg text-left transition-all group ${
                    isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-300/50 hover:text-gray-900'
                  }`}
                >
                  <MessageSquare className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    isDarkMode
                      ? 'text-gray-500 group-hover:text-gray-400'
                      : 'text-gray-500 group-hover:text-gray-600'
                  }`} />
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-medium truncate text-left">{chat.title}</span>
                    <span className={`text-xs truncate ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-600'
                    }`}>{formatDate(chat.timestamp)}</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center px-4">
            <MessageSquare className={`w-8 h-8 mb-2 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-500' : 'text-gray-600'
            }`}>No chat history yet</p>
            <p className={`text-xs mt-1 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-500'
            }`}>Start a new chat to create history</p>
          </div>
        )}
      </div>


    </div>
  );
};

export default Sidebar;
