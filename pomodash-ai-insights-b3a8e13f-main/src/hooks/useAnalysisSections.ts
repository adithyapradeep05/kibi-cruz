
import { useMemo } from 'react';

export const useAnalysisSections = (analysis: string) => {
  return useMemo(() => {
    if (!analysis) return {};
    
    const sections: Record<string, string> = {};
    let currentSection = 'overview';
    let currentContent = '';
    
    const lines = analysis.split('\n');
    
    for (const line of lines) {
      if (line.includes('🔍') && line.includes('Productivity')) {
        currentSection = 'overview';
        currentContent = line + '\n';
      } else if (line.includes('⏱️') && line.includes('Timing')) {
        sections[currentSection] = currentContent;
        currentSection = 'timing';
        currentContent = line + '\n';
      } else if (line.includes('📊') && line.includes('Content')) {
        sections[currentSection] = currentContent;
        currentSection = 'content';
        currentContent = line + '\n';
      } else if (line.includes('💡') && line.includes('Actionable')) {
        sections[currentSection] = currentContent;
        currentSection = 'suggestions';
        currentContent = line + '\n';
      } else if (line.includes('🎯') && line.includes('Focus')) {
        sections[currentSection] = currentContent;
        currentSection = 'strategy';
        currentContent = line + '\n';
      } else {
        currentContent += line + '\n';
      }
    }
    
    sections[currentSection] = currentContent;
    
    return sections;
  }, [analysis]);
};
