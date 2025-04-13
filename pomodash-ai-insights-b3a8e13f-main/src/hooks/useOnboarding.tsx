
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';

export const useOnboarding = () => {
  const { user, profile } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  useEffect(() => {
    if (user && (!profile?.first_name || !profile?.avatar_url)) {
      // Check if user has completed profile
      const hasCompletedOnboarding = localStorage.getItem('kiwi-onboarding-completed');
      
      if (!hasCompletedOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, [user, profile]);
  
  const completeOnboarding = () => {
    localStorage.setItem('kiwi-onboarding-completed', 'true');
    setShowOnboarding(false);
  };
  
  return {
    showOnboarding,
    setShowOnboarding,
    completeOnboarding
  };
};
