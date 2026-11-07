import React from 'react';

const QualityDashboard = ({ analysisData, currentMode, isDarkMode }) => {
  if (!analysisData) return null;

  const renderMetricBar = (label, value, color) => {
    const clamped = Math.min(100, Math.max(0, value));
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span>{label}</span>
          <span>{clamped}%</span>
        </div>
        <div className="h-2 w-full bg-gray-300/40 rounded-full overflow-hidden">
          <div
            className={`${color} h-full rounded-full transition-all duration-500`}
            style={{ width: `${clamped}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={`hidden lg:flex flex-col w-72 gap-5 p-4 rounded-2xl shadow-xl border transition-colors duration-300 ${
      isDarkMode
        ? 'bg-gray-900/60 border-gray-700'
        : 'bg-white/70 border-gray-200'
    }`}>
      <div className="flex items-center justify-between">
        <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Quality Dashboard</h4>
        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{currentMode}</span>
      </div>

      {renderMetricBar('Plagiarism', analysisData.plagiarism, 'bg-red-500')}
      {renderMetricBar('Novelty', analysisData.novelty, 'bg-emerald-500')}
      {renderMetricBar('Human Content', analysisData.human, 'bg-indigo-500')}
      {renderMetricBar('AI Content', analysisData.ai, 'bg-purple-500')}

      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        These metrics are estimated based on the generated idea. Use them to gauge originality, potential overlap, and AI influence.
      </p>
    </div>
  );
};

export default QualityDashboard;
