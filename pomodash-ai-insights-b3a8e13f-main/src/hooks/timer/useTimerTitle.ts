
import { useEffect, useRef } from 'react';
import { formatTime } from './timerUtils';
import { TimerState } from '@/types/timer';

interface UseTimerTitleProps {
  timerState: TimerState;
  getPhaseName: () => string;
}

export function useTimerTitle({ timerState, getPhaseName }: UseTimerTitleProps) {
  const originalTitle = useRef<string>(document.title);

  // Title update effect - separate from the timer logic for clarity
  useEffect(() => {
    const updateTitle = () => {
      if (timerState.isRunning) {
        const timeString = formatTime(timerState.timeRemaining);
        const phaseName = getPhaseName();
        document.title = `${timeString} - ${phaseName} | Kiwi`;
      } else {
        document.title = originalTitle.current;
      }
    };
    
    // Update when the timer state changes (running/not running)
    updateTitle();
    
    // Set up interval for continuous updates when timer is running
    let titleInterval: number | null = null;
    if (timerState.isRunning) {
      titleInterval = window.setInterval(updateTitle, 1000);
    }
    
    return () => {
      if (titleInterval) clearInterval(titleInterval);
      document.title = originalTitle.current;
    };
  }, [timerState.isRunning, timerState.timeRemaining, getPhaseName]);

  return {
    originalTitle
  };
}
