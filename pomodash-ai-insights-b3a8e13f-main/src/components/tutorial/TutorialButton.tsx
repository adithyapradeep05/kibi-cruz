
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { useTutorial } from '@/contexts/TutorialContext';

const TutorialButton: React.FC = () => {
  const { toggleTutorial, isTutorialOpen } = useTutorial();
  
  return (
    <Button
      variant={isTutorialOpen ? "cartoon" : "cartoon-outline"}
      size="sm"
      onClick={toggleTutorial}
      className={`text-sm rounded-xl ${
        isTutorialOpen 
          ? 'bg-[#10b981] text-white border-[#0f172a]' 
          : 'bg-transparent text-[#10b981] border-[#0f172a]'
      } transform hover:scale-105 active:scale-95 active:translate-y-1 transition-all duration-200 border-[3px] shadow-[0_5px_0_rgba(15,23,42,0.6)] hover:shadow-[0_7px_0_rgba(15,23,42,0.6)] active:shadow-[0_2px_0_rgba(15,23,42,0.6)]`}
    >
      <BookOpen className="mr-1 h-4 w-4" />
      {isTutorialOpen ? 'close tutorial' : 'tutorial'}
    </Button>
  );
};

export default TutorialButton;
