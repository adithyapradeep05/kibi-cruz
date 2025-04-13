
import React from 'react';
import { TimerPhase } from '@/types/timer';
import { useTimer } from '@/hooks/useTimer';
import TimerPhaseSelector from './TimerPhaseSelector';
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';
import TimerSettings from './TimerSettings';

interface TimerProps {
  onSessionComplete: (phase: TimerPhase, duration: number) => void;
}

const Timer: React.FC<TimerProps> = ({ onSessionComplete }) => {
  const {
    settings,
    setSettings,
    timerState,
    formatTime,
    getPhaseName,
    toggleTimer,
    resetTimer,
    toggleSettings,
    changePhase
  } = useTimer({ onSessionComplete });

  // Calculate progress percentage
  const calculateProgress = () => {
    let totalDuration = 0;
    
    // Get the total duration for the current phase
    switch (timerState.currentPhase) {
      case 'work':
        totalDuration = settings.workMinutes * 60;
        break;
      case 'shortBreak':
        totalDuration = settings.shortBreakMinutes * 60;
        break;
      case 'longBreak':
        totalDuration = settings.longBreakMinutes * 60;
        break;
    }
    
    if (totalDuration === 0) return 0;
    
    // Calculate percentage of time remaining
    const elapsed = totalDuration - timerState.timeRemaining;
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">      
      <TimerPhaseSelector 
        currentPhase={timerState.currentPhase} 
        onChangePhase={changePhase} 
      />
      
      <TimerDisplay 
        time={formatTime(timerState.timeRemaining)} 
        phaseName={getPhaseName()} 
        progress={calculateProgress()}
      />

      <TimerControls 
        isRunning={timerState.isRunning}
        onToggleTimer={toggleTimer}
        onResetTimer={resetTimer}
        onToggleSettings={toggleSettings}
      />

      <TimerSettings 
        isVisible={timerState.showSettings}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </div>
  );
};

export default Timer;
