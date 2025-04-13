
import React from 'react';

const AnalyzingIndicator: React.FC = () => {
  return (
    <div className="flex flex-col items-center py-6">
      <div className="animate-spin rounded-xl h-10 w-10 border-b-4 border-[#33C3F0] mb-4 border-r-4 border-r-[#33C3F0]/30"></div>
      <p className="text-white font-extrabold text-lg drop-shadow-md">Analyzing your work patterns...</p>
    </div>
  );
};

export default AnalyzingIndicator;
