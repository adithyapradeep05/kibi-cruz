
import { useState, useEffect, useRef } from 'react';
import { TimerPhase, TimerSettings } from '@/types/timer';
import { UseTimerProps, UseTimerReturn } from './timer/timerTypes';
import { formatTime, getPhaseName, getPhaseColorClass } from './timer/timerUtils';
import { usePhaseManagement } from './timer/usePhaseManagement';
import { useTimerControls } from './timer/useTimerControls';
import { useTimerTitle } from './timer/useTimerTitle';

export function useTimer({ onSessionComplete }: UseTimerProps): UseTimerReturn {
  const [settings, setSettings] = useState<TimerSettings>({
    workMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    pomosBeforeLongBreak: 4
  });
  
  const intervalRef = useRef<number | null>(null);
  
  const clearTimerInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const { 
    timerState, 
    setTimerState, 
    handlePhaseCompletion 
  } = usePhaseManagement({ 
    settings, 
    onSessionComplete 
  });

  const {
    toggleTimer,
    resetTimer,
    toggleSettings,
    changePhase
  } = useTimerControls({
    timerState,
    setTimerState,
    clearInterval: clearTimerInterval,
    settings
  });

  const formatTimeWrapper = (seconds: number) => formatTime(seconds);
  const getPhaseNameWrapper = () => getPhaseName(timerState.currentPhase);
  const getPhaseColorClassWrapper = () => getPhaseColorClass(timerState.currentPhase);

  useTimerTitle({
    timerState,
    getPhaseName: getPhaseNameWrapper
  });

  // Main timer logic
  useEffect(() => {
    if (timerState.isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimerState(prev => {
          if (prev.timeRemaining <= 1) {
            clearTimerInterval();
            handlePhaseCompletion();
            return prev;
          }
          
          return {
            ...prev,
            timeRemaining: prev.timeRemaining - 1
          };
        });
      }, 1000);
    } else {
      clearTimerInterval();
    }
    
    return clearTimerInterval;
  }, [timerState.isRunning]);

  return {
    settings,
    setSettings,
    timerState,
    formatTime: formatTimeWrapper,
    getPhaseName: getPhaseNameWrapper,
    getPhaseColorClass: getPhaseColorClassWrapper,
    toggleTimer,
    resetTimer,
    toggleSettings,
    changePhase
  };
}
