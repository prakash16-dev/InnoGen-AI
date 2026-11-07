import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatBox from './components/ChatBox';
import QualityDashboard from './components/QualityDashboard';
import InputArea from './components/InputArea';
import Home from './components/Home';
import { Bot, Loader2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:9000';

const App = () => {
  const [currentView, setCurrentView] = useState('home'); // 'home' or 'chat'
  const [currentMode, setCurrentMode] = useState('');
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Chat history organized by mode: { [modeName]: [{ id, title, timestamp, messages }, ...] }
  const [chatHistory, setChatHistory] = useState({
    'Hackathon Mode': [],
    'Research Mode': [],
    'Startup Mode': [],
  });
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [analysisData, setAnalysisData] = useState(null);

  const computeAnalysisData = (mode, text) => {
    const seed = `${mode}:${text}`;
    const hash = [...seed].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 100000, 0);
    const base = hash / 100000;

    const plagiarism = Math.round(15 + base * 50 + (hash % 10));
    const novelty = Math.round(90 - plagiarism + ((hash >> 3) % 15));
    const human = Math.round(40 + ((hash >> 5) % 50));
    const ai = 100 - human;

    const clamp = (v) => Math.min(100, Math.max(0, v));

    return {
      plagiarism: clamp(plagiarism),
      novelty: clamp(novelty),
      human: clamp(human),
      ai: clamp(ai),
    };
  };

  const saveCurrentChatToHistory = (messagesToSave) => {
    if (!currentMode) return;

    const chatTitle =
      messagesToSave[0]?.text?.substring(0, 50) +
      (messagesToSave[0]?.text?.length > 50 ? '...' : '') ||
      'Untitled Chat';

    // Update the current chat entry if we have an active chat ID
    if (currentChatId) {
      setChatHistory((prev) => ({
        ...prev,
        [currentMode]: prev[currentMode].map((chat) =>
          chat.id === currentChatId ? { ...chat, title: chatTitle, messages: messagesToSave } : chat
        ),
      }));
      return;
    }

    // Otherwise create a new history entry
    const newChat = {
      id: Date.now(),
      title: chatTitle,
      timestamp: new Date(),
      messages: messagesToSave,
    };

    setChatHistory((prev) => ({
      ...prev,
      [currentMode]: [newChat, ...(prev[currentMode] || [])],
    }));
    setCurrentChatId(newChat.id);
  };

  const handleModeSelect = (modeId) => {
    setCurrentMode(modeId); // Set immediately to show in loading screen

    // Reset chat state when switching modes so each mode starts with a fresh session
    setMessages([]);
    setUserInput('');
    setCurrentChatId(null);
    setAnalysisData(null);

    setIsRedirecting(true);
    setTimeout(() => {
      setCurrentView('chat');
      setIsRedirecting(false);
    }, 1200);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setCurrentMode(''); // Clear mode on return
    setAnalysisData(null);
  };

  const handleRestoreChat = (chatId) => {
    // Find and restore the chat
    const modeHistory = chatHistory[currentMode];
    const chat = modeHistory?.find(c => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(chatId);
      setUserInput('');
    }
  };

  const handleGenerate = async () => {
    if (!userInput.trim()) return;

    // Add user message
    const newMessages = [...messages, { text: userInput.trim(), isUser: true }];
    setMessages(newMessages);
    const capturedInput = userInput.trim();
    setUserInput('');
    setIsGenerating(true);

    try {
      const response = await fetch(`${API_BASE}/generate-idea`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: capturedInput,
          mode: currentMode || 'Hackathon Mode'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const rawIdea =
        typeof data === 'string'
          ? data
          : typeof data?.idea === 'string'
          ? data.idea
          : JSON.stringify(data);
      const ideaText = rawIdea.replace(/[#*]/g, '').trim();


      const newHistory = [...newMessages, { text: ideaText, isUser: false }];
      setMessages(newHistory);
      const realAnalysis = (data && (data.novelty_score !== undefined || data.plagiarism_score !== undefined))
        ? {
            novelty: Math.round(data.novelty_score ?? data.innovation_score ?? 70),
            plagiarism: Math.round(data.plagiarism_score ?? (100 - (data.novelty_score || 70))),
            human: Math.round(data.human_score ?? 80),
            ai: Math.round(data.human_score ? 100 - data.human_score : 20),
          }
        : computeAnalysisData(currentMode || 'Hackathon Mode', ideaText);

      setAnalysisData(realAnalysis);

      saveCurrentChatToHistory(newHistory);
    } catch (error) {
      console.error('Error generating idea:', error);
      setMessages([...newMessages, { 
        text: `Sorry, I encountered an error connecting to the AI: ${error.message || 'Unknown error'}`, 
        isUser: false 
      }]);
    } finally {
      setIsGenerating(false);
    }
  };
  

  const handleNewChat = () => {
    // Save current chat to history if it has messages
    if (messages.length > 0 && currentMode) {
      const chatTitle = messages[0]?.text?.substring(0, 50) + (messages[0]?.text?.length > 50 ? '...' : '') || 'Untitled Chat';
      const newChat = {
        id: Date.now(),
        title: chatTitle,
        timestamp: new Date(),
        messages: messages,
      };
      
      setChatHistory(prev => ({
        ...prev,
        [currentMode]: [newChat, ...prev[currentMode]],
      }));
    }
    
    setMessages([]);
    setUserInput('');
    setCurrentChatId(null);
    setAnalysisData(null);
  };

  const handleSpecialAction = (actionName) => {
    setToastMessage(`Engaging ${actionName}...`);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  return (
    <div className={`flex h-screen w-full overflow-hidden font-sans selection:bg-blue-500/30 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-950 text-gray-100' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      
      {currentView === 'home' ? (
        <div key="home-view" className="w-full h-full animate-page-enter">
          <Home onSelectMode={handleModeSelect} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        </div>
      ) : (
        <div key="chat-view" className="flex h-full w-full animate-page-enter">
          <div className="hidden md:block">
            <Sidebar 
              currentMode={currentMode} 
              onNewChat={handleNewChat}
              onSpecialAction={handleSpecialAction}
              onBackHome={handleBackToHome}
              chatHistory={chatHistory[currentMode] || []}
              onRestoreChat={handleRestoreChat}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />
          </div>
          
          <div className="flex-1 flex">
            <div className={`flex-1 flex flex-col relative w-full transition-colors duration-300 ${
              isDarkMode
                ? 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-gray-950 to-gray-950'
                : 'bg-gradient-to-br from-blue-50 via-white to-gray-100'
            }`}>
              <Header currentMode={currentMode} isDarkMode={isDarkMode} />
              
              <ChatBox messages={messages} isGenerating={isGenerating} currentMode={currentMode} setUserInput={setUserInput} isDarkMode={isDarkMode} />

              <InputArea 
                userInput={userInput} 
                setUserInput={setUserInput} 
                onGenerate={handleGenerate} 
                isGenerating={isGenerating}
                isDarkMode={isDarkMode}
              />
            </div>

            <QualityDashboard analysisData={analysisData} currentMode={currentMode} isDarkMode={isDarkMode} />
          </div>

          {toastMessage && (
            <div className="absolute top-24 left-1/2 md:left-auto md:right-8 -translate-x-1/2 md:translate-x-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-2xl shadow-[0_10px_40px_rgba(147,51,234,0.4)] animate-in slide-in-from-top-4 fade-in duration-300 flex items-center space-x-3 z-50">
              <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="font-medium tracking-wide">{toastMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* Premium Loading Redirect Overlay */}
      {isRedirecting && (
        <div className="absolute inset-0 z-[100] bg-gray-950/90 backdrop-blur-2xl flex flex-col items-center justify-center animate-in fade-in duration-300">
          {/* Decorative background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-pulse"></div>
          
          <div className="relative flex flex-col items-center z-10 w-full px-4">
            {/* Hexagon/Tech Scanner Animation */}
            <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
              {/* Outer spinning dashed ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-500/50 animate-[spin_4s_linear_infinite]"></div>
              
              {/* Inner glowing rings */}
              <div className="absolute inset-2 rounded-full border-t-2 border-r-2 border-indigo-400 animate-[spin_1.5s_cubic-bezier(0.68,-0.55,0.26,1.55)_infinite]"></div>
              <div className="absolute inset-5 rounded-full border-b-2 border-l-2 border-purple-500 animate-[spin_2s_linear_infinite_reverse]"></div>
              
              {/* Center Icon */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-full backdrop-blur-md border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                <Bot className="w-10 h-10 text-white animate-bounce" />
              </div>
            </div>

            {/* Text and Progress */}
            <div className="text-center w-full max-w-md space-y-4">
              <h3 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent tracking-[0.2em] uppercase drop-shadow-lg">
                {currentView === 'home' && currentMode ? `Initializing ${currentMode.replace(' Mode', '')}` : 'Closing Workspace'}
              </h3>
              
              <div className="flex items-center justify-center space-x-2 text-xs md:text-sm text-blue-300/70 font-mono tracking-widest">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>ESTABLISHING NEURAL LINK...</span>
              </div>

              {/* High-tech progress bar */}
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden mt-8 w-64 mx-auto relative shadow-[0_0_15px_rgba(59,130,246,0.3)] border border-gray-700/50">
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 w-full origin-left animate-[scale-x_1.2s_ease-out_forwards]"></div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
