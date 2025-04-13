
import { TimerPhase, TimerState } from '@/types/timer';
import { getTimerDuration } from './timerUtils';

interface UseTimerControlsProps {
  timerState: TimerState;
  setTimerState: React.Dispatch<React.SetStateAction<TimerState>>;
  clearInterval: () => void;
  settings: any;
}

export function useTimerControls({
  timerState,
  setTimerState,
  clearInterval,
  settings
}: UseTimerControlsProps) {
  
  const toggleTimer = () => {
    if (navigator.vibrate) {
      navigator.vibrate(20);
    }
    
    setTimerState(prev => ({
      ...prev,
      isRunning: !prev.isRunning
    }));
  };

  const resetTimer = () => {
    if (navigator.vibrate) {
      navigator.vibrate([20, 50, 20]);
    }
    
    clearInterval();
    
    const phaseDuration = getTimerDuration(timerState.currentPhase, settings);
    
    setTimerState(prev => ({
      ...prev,
      isRunning: false,
      timeRemaining: phaseDuration
    }));
  };

  const toggleSettings = () => {
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
    
    setTimerState(prev => ({
      ...prev,
      showSettings: !prev.showSettings
    }));
  };

  const changePhase = (phase: TimerPhase) => {
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
    
    setTimerState(prev => ({
      ...prev,
      currentPhase: phase,
      isRunning: false
    }));
  };

  return {
    toggleTimer,
    resetTimer,
    toggleSettings,
    changePhase
  };
}
