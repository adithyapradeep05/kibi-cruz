
import { TimerPhase, TimerSettings, TimerState } from '@/types/timer';

export interface UseTimerProps {
  onSessionComplete: (phase: TimerPhase, duration: number) => void;
}

export interface UseTimerReturn {
  settings: TimerSettings;
  setSettings: React.Dispatch<React.SetStateAction<TimerSettings>>;
  timerState: TimerState;
  formatTime: (seconds: number) => string;
  getPhaseName: () => string;
  getPhaseColorClass: () => string;
  toggleTimer: () => void;
  resetTimer: () => void;
  toggleSettings: () => void;
  changePhase: (phase: TimerPhase) => void;
}
