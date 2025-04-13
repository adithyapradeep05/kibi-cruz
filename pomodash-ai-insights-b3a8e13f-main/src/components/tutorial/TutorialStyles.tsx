
import React from 'react';

const TutorialStyles: React.FC = () => {
  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        .tutorial-highlight {
          position: relative;
          z-index: 10;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.7), 0 0 0 8px rgba(16, 185, 129, 0.3);
          border-radius: 8px;
          animation: tutorial-pulse 2s infinite;
          transition: all 0.5s ease;
        }
        
        .tutorial-highlight::after {
          content: '';
          position: absolute;
          inset: -10px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0) 70%);
          border-radius: 12px;
          z-index: -1;
          pointer-events: none;
        }
        
        @keyframes tutorial-pulse {
          0% {
            box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.7), 0 0 0 8px rgba(16, 185, 129, 0.3);
          }
          50% {
            box-shadow: 0 0 0 6px rgba(16, 185, 129, 0.7), 0 0 0 12px rgba(16, 185, 129, 0.3);
          }
          100% {
            box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.7), 0 0 0 8px rgba(16, 185, 129, 0.3);
          }
        }
      `
    }} />
  );
};

export default TutorialStyles;
