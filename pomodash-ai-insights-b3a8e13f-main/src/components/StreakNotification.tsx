
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Flame, Award, Trophy } from 'lucide-react';
import { 
  StreakData, 
  getStreakFromStorage, 
  getStreakFromSupabase 
} from '@/utils/storage';
import { differenceInCalendarDays, isYesterday } from 'date-fns';

const STREAK_RECOVERY_KEY = 'kiwi_streak_recovery_shown';
const STREAK_MILESTONE_SHOWN_KEY = 'kiwi_streak_milestone_shown';

const StreakNotification: React.FC = () => {
  const { toast } = useToast();
  const [streak, setStreak] = useState<StreakData | null>(null);
  
  useEffect(() => {
    const loadStreak = async () => {
      // Try to get streak from Supabase first
      try {
        const streakData = await getStreakFromSupabase();
        setStreak(streakData);
        checkStreakNotifications(streakData);
      } catch (error) {
        // Fall back to local storage
        const localStreak = getStreakFromStorage();
        setStreak(localStreak);
        checkStreakNotifications(localStreak);
      }
    };
    
    loadStreak();
  }, []);

  const checkStreakNotifications = (streakData: StreakData) => {
    if (!streakData || !streakData.lastLoggedDate) return;
    
    const { currentStreak, lastLoggedDate, graceUsed } = streakData;
    
    // Check if we need to show streak recovery notification
    checkRecoveryNotification(lastLoggedDate, graceUsed);
    
    // Check for milestone notifications
    checkMilestoneNotification(currentStreak);
  };
  
  const checkRecoveryNotification = (lastLoggedDate: string, graceUsed: boolean) => {
    if (!lastLoggedDate || graceUsed) return;
    
    const lastLogDate = new Date(lastLoggedDate);
    const today = new Date();
    const daysSinceLastLog = differenceInCalendarDays(today, lastLogDate);
    
    // If it's been exactly 2 days since last log, show recovery notification
    if (daysSinceLastLog === 2) {
      // Check if we've already shown this notification today
      const recoveryShown = localStorage.getItem(STREAK_RECOVERY_KEY);
      const recoveryShownDate = recoveryShown ? new Date(recoveryShown) : null;
      
      if (!recoveryShownDate || !isYesterday(recoveryShownDate)) {
        toast({
          title: "Recover Your Streak",
          description: "You missed yesterday - focus today to recover your streak!",
          duration: 8000,
        });
        
        // Set that we've shown this notification
        localStorage.setItem(STREAK_RECOVERY_KEY, new Date().toISOString());
      }
    }
  };
  
  const checkMilestoneNotification = (currentStreak: number) => {
    if (currentStreak <= 0) return;
    
    // Define milestones to show notifications for
    const milestones = [3, 7, 14, 30, 50, 100];
    
    // Check if current streak is a milestone
    const isMilestone = milestones.includes(currentStreak);
    
    if (isMilestone) {
      // Check if we've already shown this milestone notification
      const milestoneShown = localStorage.getItem(STREAK_MILESTONE_SHOWN_KEY);
      const parsedMilestone = milestoneShown ? JSON.parse(milestoneShown) : { streak: 0, date: '' };
      
      // Only show if we haven't shown this milestone yet
      if (parsedMilestone.streak < currentStreak) {
        let icon = <Flame className="text-green" />;
        if (currentStreak >= 30) {
          icon = <Trophy className="text-purple" />;
        } else if (currentStreak >= 7) {
          icon = <Award className="text-orange" />;
        }
        
        let message = '';
        
        switch (currentStreak) {
          case 3:
            message = "You're finding your rhythm.";
            break;
          case 7:
            message = "That's a full week of wins!";
            break;
          case 14:
            message = "You're built different.";
            break;
          case 30:
            message = "Your future self is clapping.";
            break;
          case 50:
            message = "Halfway to a core memory!";
            break;
          case 100:
            message = "This might change your life.";
            break;
          default:
            message = "Keep the momentum going!";
        }
        
        toast({
          title: `${currentStreak}-Day Streak!`,
          description: message,
          duration: 10000,
        });
        
        // Save that we've shown this milestone
        localStorage.setItem(
          STREAK_MILESTONE_SHOWN_KEY, 
          JSON.stringify({ streak: currentStreak, date: new Date().toISOString() })
        );
      }
    }
  };
  
  // This component doesn't render anything visible
  return null;
};

export default StreakNotification;
