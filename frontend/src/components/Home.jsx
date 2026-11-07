import React from 'react';
import { Lightbulb, FileSearch, Rocket, Bot, Sun, Moon } from 'lucide-react';

const Home = ({ onSelectMode, isDarkMode, setIsDarkMode }) => {
  const modes = [
    {
      id: 'Hackathon Mode',
      title: 'Hackathon',
      description: 'Generate winning project ideas, architecture stacks, and pitch templates for your next competitive hackathon.',
      icon: Lightbulb,
      color: 'from-blue-500 to-cyan-400',
      glowShadow: 'hover:shadow-[0_0_60px_-15px_rgba(59,130,246,0.6)]',
    },
    {
      id: 'Research Mode',
      title: 'Research',
      description: 'Explore novel directions, discover untapped methodologies, and formulate structured abstracts for academic papers.',
      icon: FileSearch,
      color: 'from-purple-500 to-pink-500',
      glowShadow: 'hover:shadow-[0_0_60px_-15px_rgba(236,72,153,0.6)]',
    },
    {
      id: 'Startup Mode',
      title: 'Startup',
      description: 'Ideate disruptive business models, identify core target demographics, and outline clear GTM strategies.',
      icon: Rocket,
      color: 'from-orange-500 to-yellow-400',
      glowShadow: 'hover:shadow-[0_0_60px_-15px_rgba(234,179,8,0.6)]',
    },
  ];

  return (
    <div className={`relative h-full w-full overflow-y-auto selection:bg-indigo-500/30 transition-colors duration-300 ${
      isDarkMode
        ? 'bg-gray-950'
        : 'bg-gray-50'
    }`}>
      
      {/* Theme Toggle Button - Top Right */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`fixed top-8 right-8 p-3 rounded-full transition-all z-50 ${
          isDarkMode
            ? 'bg-gray-800/50 hover:bg-gray-700 text-yellow-400 border border-gray-700'
            : 'bg-white/50 hover:bg-gray-100 text-blue-500 border border-gray-300'
        }`}
        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>

      {/* Abstract Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] animate-pulse [animation-duration:8s] ${
          isDarkMode
            ? 'bg-blue-600/20'
            : 'bg-blue-400/10'
        }`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[150px] animate-pulse [animation-duration:10s] ${
          isDarkMode
            ? 'bg-purple-600/20'
            : 'bg-purple-400/10'
        }`}></div>
        <div className={`absolute top-[20%] right-[10%] w-[20%] h-[20%] rounded-full blur-[80px] ${
          isDarkMode
            ? 'bg-cyan-400/10'
            : 'bg-cyan-300/5'
        }`}></div>
      </div>

      <div className="relative flex flex-col items-center justify-start min-h-full w-full px-4 py-12 md:py-20 lg:py-24 z-10">
        
        <div className="text-center mb-20 max-w-4xl animate-in slide-in-from-bottom-8 fade-in duration-1000">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[2rem] blur opacity-40 group-hover:opacity-60 transition duration-500"></div>
              <div className={`relative w-20 h-20 rounded-[2rem] flex items-center justify-center border shadow-2xl transition-colors duration-300 ${
                isDarkMode
                  ? 'bg-gray-900 border-gray-700/50'
                  : 'bg-white border-gray-300/50'
              }`}>
                <Bot className="w-10 h-10 text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
              </div>
            </div>
          </div>
          <h1 className={`text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter bg-clip-text text-transparent pb-2 md:pb-4 leading-[1.1] ${
            isDarkMode
              ? 'bg-gradient-to-b from-white via-gray-200 to-gray-500'
              : 'bg-gradient-to-b from-gray-900 via-gray-700 to-gray-600'
          }`}>
            InnoGen <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">AI</span>
        </h1>
        <p className={`text-lg md:text-2xl leading-relaxed max-w-3xl mx-auto font-light tracking-wide ${
          isDarkMode
            ? 'text-gray-400/80'
            : 'text-gray-600/80'
        }`}>
          Your intelligent ideation engine. Choose a specialized domain below to instantly generate tailored concepts and executable strategies.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 max-w-7xl w-full px-4 mb-12 relative perspective-1000">
        {modes.map((mode, index) => {
          const Icon = mode.icon;
          return (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              className={`group relative text-left rounded-[2.5rem] p-8 md:p-10 backdrop-blur-2xl transition-all duration-700 overflow-hidden animate-in slide-in-from-bottom-12 fade-in fill-mode-both hover:-translate-y-5 hover:scale-105 transform-style-3d active:translate-y-0 active:scale-95 active:rotate-x-0 active:rotate-y-0 ${
                isDarkMode
                  ? 'bg-gray-950/40 border border-white/5 hover:border-white/20'
                  : 'bg-white/40 border border-gray-400/20 hover:border-gray-600/30'
              } ${mode.glowShadow}`}
              style={{ animationDelay: `${index * 150}ms`, transformStyle: 'preserve-3d' }}
            >
              {/* Glass Reflection Sweep */}
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 z-20 pointer-events-none"></div>

              {/* Background gradient sphere inside card */}
              <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${mode.color} rounded-full blur-[80px] opacity-10 group-hover:opacity-50 transition-all duration-700 group-hover:scale-150 -translate-y-1/2 translate-x-1/3 pointer-events-none`}></div>
              
              {/* Subtle grid pattern for tech feel */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

              <div className="relative z-30 flex flex-col h-full transform transition-transform duration-700 group-hover:translate-z-12">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-gradient-to-br ${mode.color} text-white shadow-[0_8px_32px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 ring-1 ring-white/20 group-hover:ring-white/50 transform group-hover:translate-z-16`}>
                  <Icon className="w-8 h-8 drop-shadow-lg" />
                </div>
                
                <h3 className={`text-3xl font-extrabold mb-4 tracking-tight drop-shadow-md transform transition-transform duration-700 group-hover:translate-z-8 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {mode.title}
                </h3>
                
                <p className={`leading-relaxed mb-10 flex-1 text-[1.1rem] font-light transition-colors duration-500 transform transition-transform duration-700 group-hover:translate-z-4 ${
                  isDarkMode
                    ? 'text-gray-400/90 group-hover:text-gray-200'
                    : 'text-gray-600/90 group-hover:text-gray-800'
                }`}>
                  {mode.description}
                </p>

                <div className={`mt-auto flex items-center text-sm font-bold space-x-3 opacity-0 -translate-x-8 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out transform group-hover:translate-z-10 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <span className={`bg-gradient-to-r ${mode.color} bg-clip-text text-transparent uppercase tracking-wider`}>Initialize Link</span>
                  <div className={`p-2 rounded-full bg-gradient-to-r ${mode.color} shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-pulse`}>
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      </div>
    </div>
  );
};

export default Home;
