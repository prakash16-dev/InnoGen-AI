import React, { useEffect, useRef } from 'react';
import Message from './Message';
import { Sparkles } from 'lucide-react';

const ChatBox = ({ messages, isGenerating, currentMode, setUserInput, isDarkMode }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  return (
    <div className={`flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth scrollbar-thin transition-colors duration-300 ${
      isDarkMode
        ? 'scrollbar-thumb-gray-700/50 scrollbar-track-transparent'
        : 'scrollbar-thumb-gray-400/50 scrollbar-track-transparent'
    }`}>
      {messages.length === 0 ? (
        <div className={`h-full flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-700 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.1)] mb-4 ${
            isDarkMode
              ? 'bg-gray-800/50'
              : 'bg-gray-200/50'
          }`}>
            <Sparkles className="w-10 h-10 text-blue-500/80" />
          </div>
          <h3 className={`text-3xl font-bold text-center ${
            isDarkMode
              ? 'bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent'
              : 'bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent'
          }`}>
            Ideate with {currentMode}
          </h3>
          <p className={`text-base max-w-md text-center leading-relaxed ${
            isDarkMode ? 'text-gray-500' : 'text-gray-600'
          }`}>
            Enter a domain below to generate innovative ideas, concepts, and project directions tailored to your needs.
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {['AI Healthcare', 'Smart Agriculture', 'Climate Tech', 'FinTech'].map((tag) => (
              <button
                key={tag}
                onClick={() => setUserInput(tag)}
                className={`px-4 py-1.5 rounded-full text-sm border transition-colors shadow-sm cursor-pointer ${
                  isDarkMode
                    ? 'bg-gray-800/80 hover:bg-gray-700 hover:text-white text-gray-400 border-gray-700/50'
                    : 'bg-gray-200/80 hover:bg-gray-300 hover:text-gray-900 text-gray-700 border-gray-300/50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 w-full pb-6 flex flex-col justify-end min-h-full">
          <div className="flex-1 w-full">
            {messages.map((msg, idx) => (
              <Message key={idx} text={msg.text} isUser={msg.isUser} currentMode={currentMode} isDarkMode={isDarkMode} />
            ))}
            {isGenerating && (
              <Message isLoading={true} isUser={false} currentMode={currentMode} isDarkMode={isDarkMode} />
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
