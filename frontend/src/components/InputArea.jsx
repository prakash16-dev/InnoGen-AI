import React, { useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

const InputArea = ({ userInput, setUserInput, onGenerate, isGenerating, isDarkMode }) => {
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onGenerate();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [userInput]);

  return (
    <div className={`p-4 md:p-6 pt-10 transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent' : 'bg-gradient-to-t from-gray-100 via-gray-100/95 to-transparent'}`}>
      <div className="max-w-4xl mx-auto w-full relative">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className={`relative rounded-3xl shadow-2xl flex items-end border transition-colors duration-300 ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700/50'
              : 'bg-white border-gray-300/50'
          }`}>
            <textarea
              ref={textareaRef}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a domain like AI Healthcare, Smart Agriculture, Climate Tech..."
              className={`w-full bg-transparent rounded-3xl pl-6 pr-14 py-4 focus:outline-none resize-none overflow-y-auto scrollbar-thin sm:text-lg min-h-[60px] max-h-[120px] ${
                isDarkMode ? 'text-gray-100 placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
              }`}
              rows="1"
              disabled={isGenerating}
            />
            <button
              onClick={onGenerate}
              disabled={!userInput.trim() || isGenerating}
              className={`absolute right-3 bottom-2.5 p-2.5 rounded-2xl transition-all duration-300 ${
                !userInput.trim() || isGenerating
                  ? isDarkMode ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed' : 'bg-gray-300/50 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:scale-105 active:scale-95'
              }`}
            >
              {isGenerating ? <Sparkles className="w-5 h-5 animate-pulse" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-gray-500 mt-4 md:block hidden tracking-wide">
        Press <kbd className="px-2 py-0.5 rounded bg-gray-800 border border-gray-700 mx-1">Enter</kbd> to generate. <kbd className="px-2 py-0.5 rounded bg-gray-800 border border-gray-700 mx-1">Shift + Enter</kbd> for new line.
      </p>
    </div>
  );
};

export default InputArea;
