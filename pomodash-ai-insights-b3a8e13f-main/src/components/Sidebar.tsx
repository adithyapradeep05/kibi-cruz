
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, Home, Clock, BarChart3, Settings, UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useOnboarding } from '@/hooks/useOnboarding';
import ProfileSetupModal from './ProfileSetupModal';

export type TabType = 'tasks' | 'timer' | 'logs' | 'trends';

interface SidebarProps {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onChange }) => {
  const { user, profile, signOut } = useAuth();
  const { showOnboarding, setShowOnboarding, completeOnboarding } = useOnboarding();
  
  const scrollToSection = (tab: TabType) => {
    onChange(tab);
    
    // Get the corresponding section element
    const section = document.getElementById(tab);
    if (section) {
      // Scroll to the section with a smooth animation
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-[96px] h-full bg-[#0f172a] flex flex-col items-center py-6">
      <div className="mb-8">
        <div className="w-16 h-16 bg-[#0f4a49] rounded-2xl flex items-center justify-center hover:bg-[#105e5d] transition-colors cursor-pointer transform hover:rotate-360 transition-all duration-700 overflow-hidden">
          <img 
            src="/lovable-uploads/7453fc0a-8b85-49b0-a816-ac4f60cf10a1.png"
            alt="Kibi Logo"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      <div className="flex-1 flex flex-col items-center gap-6">
        <button 
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-md border-[3px]",
            activeTab === 'timer' 
              ? "bg-[#10b981] text-[#0f172a] shadow-[#10b981]/20 border-[#0f172a]" 
              : "bg-[#151e2d] text-[#10b981] hover:bg-[#10b981]/30 hover:text-white border-[#0f172a]/40"
          )}
          onClick={() => scrollToSection('timer')}
        >
          <Home className="h-6 w-6" />
        </button>
        
        <button 
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-md border-[3px]",
            activeTab === 'logs' 
              ? "bg-[#10b981] text-[#0f172a] shadow-[#10b981]/20 border-[#0f172a]" 
              : "bg-[#151e2d] text-[#10b981] hover:bg-[#10b981]/30 hover:text-white border-[#0f172a]/40"
          )}
          onClick={() => scrollToSection('logs')}
        >
          <Clock className="h-6 w-6" />
        </button>
        
        <button 
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-md border-[3px]",
            activeTab === 'trends' 
              ? "bg-[#10b981] text-[#0f172a] shadow-[#10b981]/20 border-[#0f172a]" 
              : "bg-[#151e2d] text-[#10b981] hover:bg-[#10b981]/30 hover:text-white border-[#0f172a]/40"
          )}
          onClick={() => scrollToSection('trends')}
        >
          <BarChart3 className="h-6 w-6" />
        </button>
      </div>
      
      <div className="mt-auto space-y-6">
        <button 
          className="w-12 h-12 rounded-full bg-[#151e2d] flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 text-[#10b981] hover:bg-[#10b981]/30 hover:text-white shadow-md border-[3px] border-[#0f172a]/40"
        >
          <Settings className="h-6 w-6" />
        </button>
        
        <Avatar 
          className="w-12 h-12 cursor-pointer hover:opacity-90 transition-opacity transform hover:scale-110 active:scale-95 border-[3px] border-[#0f172a]/40" 
          onClick={() => setShowOnboarding(true)}
        >
          {profile?.avatar_url ? (
            <AvatarImage src={profile.avatar_url} alt="Profile" />
          ) : (
            <AvatarFallback className="bg-[#151e2d] text-[#10b981]">
              <UserCircle className="h-6 w-6" />
            </AvatarFallback>
          )}
        </Avatar>
        
        <button 
          onClick={signOut}
          className="w-12 h-12 rounded-full bg-[#151e2d] flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 text-[#10b981] hover:bg-[#10b981]/30 hover:text-white shadow-md border-[3px] border-[#0f172a]/40"
        >
          <LogOut className="h-6 w-6" />
        </button>
      </div>
      
      <ProfileSetupModal isOpen={showOnboarding} onClose={completeOnboarding} />
    </div>
  );
};

export default Sidebar;
