import React, { useState } from 'react';
import { User, Sparkles, FileText, Loader2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:9000';

const Message = ({ text, isUser, isLoading, currentMode, isDarkMode }) => {
  const [isGeneratingPPT, setIsGeneratingPPT] = useState(false);
  const [isGeneratingPaper, setIsGeneratingPaper] = useState(false);

  const cleanText = typeof text === 'string' ? text.replace(/[#*]/g, '') : text;


  const generatePaper = async () => {
    setIsGeneratingPaper(true);
    try {
      const response = await fetch(`${API_BASE}/generate-paper`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: cleanText
        })

      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "IEEE_Research_Paper.docx";
      if (contentDisposition && contentDisposition.includes("filename=")) {
        filename = contentDisposition.split("filename=")[1].replace(/["']/g, "");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
    } catch (error) {
      console.error("Error generating Paper:", error);
      alert(`Failed to generate Research Paper: ${error.message}`);
    } finally {
      setIsGeneratingPaper(false);
    }
  };

  const generatePPT = async () => {
    setIsGeneratingPPT(true);
    try {
      const response = await fetch(`${API_BASE}/generate-ppt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: cleanText,
          mode: currentMode
        })

      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "presentation.pptx";
      if (contentDisposition && contentDisposition.includes("filename=")) {
        filename = contentDisposition.split("filename=")[1].replace(/["']/g, "");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
    } catch (error) {
      console.error("Error generating PPT:", error);
      alert(`Failed to generate PPT: ${error.message}`);
    } finally {
      setIsGeneratingPPT(false);
    }
  };
  return (
    <div className={`flex w-full mb-6 group ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-3 space-x-reverse`}>
        <div className={`flex-shrink-0 w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 duration-300 ${isUser ? 'bg-gradient-to-tr from-blue-600 to-indigo-500 ml-3' : 'bg-gradient-to-tr from-purple-600 to-blue-500 mr-3'}`}>
          {isUser ? <User className="w-5 h-5 text-white" /> : <Sparkles className="w-5 h-5 text-white" />}
        </div>
        
        <div className={`px-6 py-4 rounded-3xl text-sm md:text-base transition-colors duration-300 ${
          isUser 
            ? 'bg-blue-600/90 text-white rounded-br-none shadow-[0_4px_14px_0_rgba(37,99,235,0.3)] backdrop-blur-sm' 
            : isDarkMode
            ? 'bg-gray-800/90 text-gray-100 rounded-bl-none shadow-[0_4px_14px_0_rgba(0,0,0,0.3)] border border-gray-700/50 backdrop-blur-sm'
            : 'bg-gray-200/90 text-gray-900 rounded-bl-none shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] border border-gray-300/50 backdrop-blur-sm'
        }`}>
          {isLoading ? (
            <div className="flex space-x-2 items-center h-6">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
            </div>
          ) : (
            <div className="flex flex-col space-y-3">
              <div className="whitespace-pre-wrap leading-relaxed font-normal">{cleanText}</div>
              <div className="flex space-x-3">
                {!isUser && currentMode === 'Hackathon Mode' && (
                  <button
                    onClick={generatePPT}
                    disabled={isGeneratingPPT || isGeneratingPaper}
                    className={`flex items-center space-x-2 text-sm py-2 px-4 rounded-xl transition-colors border w-max ${
                      isDarkMode
                        ? 'bg-purple-600/20 hover:bg-purple-600/40 text-purple-200 border-purple-500/30'
                        : 'bg-purple-200/40 hover:bg-purple-300/40 text-purple-800 border-purple-400/30'
                    }`}
                  >
                    {isGeneratingPPT ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                    <span>{isGeneratingPPT ? 'Generating PPT...' : 'Generate PPT'}</span>
                  </button>
                )}

                {!isUser && currentMode === 'Research Mode' && (
                  <button
                    onClick={generatePaper}
                    disabled={isGeneratingPPT || isGeneratingPaper}
                    className={`flex items-center space-x-2 text-sm py-2 px-4 rounded-xl transition-colors border w-max ${
                      isDarkMode
                        ? 'bg-blue-600/20 hover:bg-blue-600/40 text-blue-200 border-blue-500/30'
                        : 'bg-blue-200/40 hover:bg-blue-300/40 text-blue-800 border-blue-400/30'
                    }`}
                  >
                    {isGeneratingPaper ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                    <span>{isGeneratingPaper ? 'Generating Paper...' : 'Generate Paper'}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
