
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import StreakDisplay from '../StreakDisplay';
import { useOnboarding } from '@/hooks/useOnboarding';
import ProfileSetupModal from '../ProfileSetupModal';
import TutorialButton from '../tutorial/TutorialButton';

interface HeaderSectionProps {
  onStartTimer: () => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  onStartTimer
}) => {
  const {
    profile
  } = useAuth();
  const {
    showOnboarding,
    setShowOnboarding,
    completeOnboarding
  } = useOnboarding();
  
  return <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 py-1 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-3 sm:mb-0">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-lg mr-2 bg-[#0f4a49] overflow-hidden">
            <img 
              src="/lovable-uploads/7453fc0a-8b85-49b0-a816-ac4f60cf10a1.png"
              alt="Kibi Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-bubblegum text-white tracking-wider font-bold">welcome {profile?.first_name || 'animesh'}</h1>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-2 items-center">
        <TutorialButton />
        
        <Button 
          onClick={onStartTimer} 
          size="sm" 
          className="rounded-full bg-kiwi-medium text-white transform hover:scale-105 active:scale-95 transition-all duration-200 hover:bg-kiwi-light shadow-md hover:shadow-lg text-xs py-1 px-3"
          data-tutorial="new-session"
        >
          <Plus className="mr-1 h-3 w-3" />
          New Focus Session
        </Button>
      </div>
      
      <ProfileSetupModal isOpen={showOnboarding} onClose={completeOnboarding} />
    </div>;
};

export default HeaderSection;
